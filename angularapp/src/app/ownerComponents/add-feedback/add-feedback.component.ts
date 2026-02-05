import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Feedback } from 'src/app/models/feedback.model';
import { FeedService } from 'src/app/services/feed.service';
import { FeedbackService } from 'src/app/services/feedback.service';
import { MedicineService } from 'src/app/services/medicine.service';

@Component({
  selector: 'app-add-feedback',
  templateUrl: './add-feedback.component.html',
  styleUrls: ['./add-feedback.component.css']
})
export class AddFeedbackComponent implements OnInit {
  userId = JSON.parse(localStorage.getItem('userId'));
  itemId: string;
  category: string = '';
  rating: number = 1;
  reviewText: string = '';
  supplierId: string = '';
  newFeedback: Feedback = {
    reviewText: '',
    category: '',
    rating: 0,
    itemId: '',
    supplierId: '',
    userId: ''
  }
  showError: boolean = false;

  constructor(private readonly feedbackService: FeedbackService, private readonly medicineService: MedicineService, private readonly feedService: FeedService, private readonly route: ActivatedRoute, private readonly router: Router, private readonly toastr: ToastrService) { }

  ngOnInit(): void {
    const queryParams = this.route.snapshot.queryParams;
    if (queryParams.medicine) {
      this.itemId = queryParams.medicine;
      this.category = 'Medicine';
      this.medicineService.getMedicineById(this.itemId).subscribe((val) => {
        this.supplierId = val.supplierId;
      })
    } else if (queryParams.feed) {
      this.itemId = queryParams.feed;
      this.category = 'Feed';
      this.feedService.getFeedById(this.itemId).subscribe((val) => {
        this.supplierId = val.supplierId;
      })
    } else {
      this.itemId = null;
      this.category = null;
    }
  }

  addRating(ratingInput: number) {
    this.rating = ratingInput;
  }

  submitReview() {
    this.newFeedback = {
      reviewText: this.reviewText,
      category: this.category,
      rating: this.rating,
      userId: this.userId,
      itemId: this.itemId,
      supplierId: this.supplierId
    };

    if (this.reviewText) {
      this.showError = false;
      this.feedbackService.addFeedback(this.newFeedback).subscribe(
        {
          next: (value) => {
            this.toastr.success("Feedback added successfully");
            if (this.category === 'Medicine') {
              this.router.navigate(['/owner/viewMedicine']);
            } else {
              this.router.navigate(['/owner/viewfeed']);
            }
          }, error: (err) => {
            this.toastr.error("Failed to add Feedback");
          }
        });
    }
    else {
      this.showError = true;
    }
  }

  navigateBack() {
    if (this.category === 'Medicine') {
      this.router.navigate(['/owner/viewMedicine']);
    } else {
      this.router.navigate(['/owner/viewfeed']);
    }
  }
}
