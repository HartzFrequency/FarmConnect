import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { LivestockService } from 'src/app/services/livestock.service';

@Component({
  selector: 'app-livestock-form',
  templateUrl: './livestock-form.component.html',
  styleUrls: ['./livestock-form.component.css']
})
export class LivestockFormComponent implements OnInit, OnDestroy {
  liveStockForm!: FormGroup;
  isEditMode = false;
  formSubmitted: boolean = false;
  editId: string = '';
  coverImageBase64: string | null = null;
  subscriptions: Subscription[] = [];

  constructor(
    private readonly service: LivestockService,
    private readonly toastr: ToastrService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly fb: FormBuilder
  ) {
    this.liveStockForm = this.fb.group({
      name: ['', Validators.required],
      species: ['', Validators.required],
      age: ['', Validators.required],
      breed: ['', Validators.required],
      healthCondition: ['', Validators.required],
      location: ['', Validators.required],
      vaccinationStatus: ['', Validators.required],
      attachment: [null]
    });
  }
  ngOnInit(): void {
    this.editId = this.route.snapshot.params.id;
    if (this.editId) {
      this.isEditMode = true;
      console.log(this.editId);
      this.subscriptions.push(this.service.getLivestockById(this.editId).subscribe(
        (value) => {
          console.log(value);
          this.liveStockForm.patchValue({
            name: value.livestock.name,
            species: value.livestock.species,
            age: value.livestock.age,
            breed: value.livestock.breed,
            healthCondition: value.livestock.healthCondition,
            location: value.livestock.location,
            vaccinationStatus: value.livestock.vaccinationStatus,
            attachment: null
          });
          this.coverImageBase64 = value.livestock.attachment;
        }
      ));
    }
  }

  get f() {
    return this.liveStockForm.controls;
  }

  handleFileChange(event: any): void {
    const file = event.target.files[0];
    if (!file) return;


    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      this.f['attachment'].setErrors({ invalidType: true });
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      this.f['attachment'].setErrors({ invalidSize: true });
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.coverImageBase64 = reader.result as string;
    };
  }

  onSubmit(): void {
    this.formSubmitted = true;
    if (this.liveStockForm.invalid) {
      this.toastr.error('Please fill all required fields correctly.');
      return;
    }
    const formData: any = this.liveStockForm.value;
    if (this.coverImageBase64) {
      formData.attachment = this.coverImageBase64;
    } else {
      delete formData.attachment;
    }
    const { name, species, breed, age, location, attachment, healthCondition, vaccinationStatus } = formData

    const userId = JSON.parse(localStorage.getItem('userId'));
    const payload = {
      name, species, breed, age, location, attachment, healthCondition, vaccinationStatus, userId
    };

    if (this.editId) {
      this.subscriptions.push(this.service.updateLivestock(this.editId, formData).subscribe({
        next: (value) => {
          this.toastr.success(`LiveStock with ID ${this.editId} updated successfully!`);
          this.router.navigate(['/owner/livestock']);
        },
        error: (err) => {
          this.toastr.error(err);
        }
      }));
    } else {
      this.subscriptions.push(this.service.addLivestock(payload).subscribe({
        next: () => {
          this.toastr.success('Livestock saved successfully!');
          this.router.navigate(['/owner/livestock']);
        },
        error: (error) => {
          console.log(error);
          this.toastr.error('Failed to save livestock.');
        }
      }));
    }
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}

