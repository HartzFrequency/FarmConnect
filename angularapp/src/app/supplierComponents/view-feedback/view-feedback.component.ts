import { Component, OnInit, OnDestroy } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FeedbackService } from 'src/app/services/feedback.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-view-feedback',
  templateUrl: './view-feedback.component.html',
  styleUrls: ['./view-feedback.component.css']
})
export class ViewFeedbackComponent implements OnInit, OnDestroy {
  feedbacks: any[] = [];
  filteredFeedbacks: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 5;
  supplierId: string = JSON.parse(localStorage.getItem('userId') ?? '""');

  loading = true;
  showEmptyMessage = false;
  subscriptions: Subscription[] = [];

  constructor(
    private readonly feedbackService: FeedbackService,
    private readonly toastr: ToastrService
  ) {}

  ngOnInit(): void {
    const timeoutId = setTimeout(() => {
      if (this.loading && this.filteredFeedbacks.length === 0) {
        this.showEmptyMessage = true;
        this.loading = false;
      }
    }, 5000);

    this.subscriptions.push(
      this.feedbackService.getAllFeedbacksBySupplier(this.supplierId).subscribe({
        next: (value) => {
          this.feedbacks = value;
          this.filteredFeedbacks = value;
          this.filteredFeedbacks.reverse();

          if (value.length > 0) {
            this.loading = false;
            this.showEmptyMessage = false;
            clearTimeout(timeoutId);
          } else {
            this.loading = false;
            this.showEmptyMessage = true;
          }
        },
        error: (err) => {
          this.loading = false;
          this.showEmptyMessage = true;
          this.toastr.error('Failed to load feedbacks. Please try again.');
        }
      })
    );
  }

  get paginatedFeedbacks(): any[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredFeedbacks.slice(start, start + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredFeedbacks.length / this.itemsPerPage);
  }

  goToPreviousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  goToNextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  search(event: any) {
    const input = event.target.value;
    if (!input) {
      this.filteredFeedbacks = this.feedbacks;
    } else {
      this.filteredFeedbacks = this.feedbacks.filter((feed) => {
        const name = feed.itemId?.feedName ?? feed.itemId?.medicineName ?? '';
        return name.toLowerCase().startsWith(input.toLowerCase());
      });
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscribe) => subscribe.unsubscribe());
  }
}
