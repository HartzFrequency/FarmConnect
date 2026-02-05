import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { FeedService } from 'src/app/services/feed.service';

@Component({
  selector: 'app-add-feed',
  templateUrl: './add-feed.component.html',
  styleUrls: ['./add-feed.component.css']
})
export class AddFeedComponent implements OnInit, OnDestroy {
  feedForm!: FormGroup;
  formSubmitted: boolean = false;
  editId: string;
  supplierId: string = JSON.parse(localStorage.getItem('userId'));
  subscriptions: Subscription[] = [];
  constructor(private readonly fb: FormBuilder, private readonly route: ActivatedRoute, private readonly router: Router, private readonly feedService: FeedService, private readonly toastr: ToastrService) {
    this.feedForm = this.fb.group({
      feedName: ['', Validators.required],
      type: ['', Validators.required],
      description: ['', Validators.required],
      unit: ['', Validators.required],
      availableUnits: ['', Validators.required],
      pricePerUnit: ['', Validators.required],
    })
  }
  ngOnInit(): void {
    this.editId = this.route.snapshot.params.id ?? null;
    if (this.editId) {
      this.subscriptions.push(this.feedService.getFeedById(this.editId).subscribe(
        (value) => {
          this.feedForm.patchValue({
            feedName: value.feedName,
            type: value.type,
            description: value.description,
            unit: value.unit,
            availableUnits: value.availableUnits,
            pricePerUnit: (value.pricePerUnit)
          })
        }
      ))
    }
  }
  onSubmit() {
    this.formSubmitted = true;
    if (this.feedForm.valid) {
      const payload = { ...this.feedForm.value, supplierId: this.supplierId }
      if (this.editId) {
        this.subscriptions.push(this.feedService.updateFeed(this.editId, payload).subscribe({
          next: (value) => {
            this.toastr.success(`Feed with ID ${this.editId} updated successfully!`);
            this.router.navigate(['/supplier/view-feed'])
          },
          error: (err) => {
            this.toastr.error(err);
          }
        }))
      } else {
        this.subscriptions.push(this.feedService.addFeed(payload).subscribe({
          next: (value) => {
            this.toastr.success("New feed added Successfully");
            this.router.navigate(['/supplier/view-feed']);
            console.log(value);
          },
          error: (err) => {
            this.toastr.error('Try again later.');
          }
        }))
      }
    }
    else {
      this.toastr.error('Please fill all required fields correctly.');
    }
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe())
  }
}
