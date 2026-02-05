import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Feed } from 'src/app/models/feed.model';
import { Request } from 'src/app/models/request.model';
import { FeedService } from 'src/app/services/feed.service';
import { LivestockService } from 'src/app/services/livestock.service';
import { RequestService } from 'src/app/services/request.service';

@Component({
  selector: 'app-owner-viewfeed',
  templateUrl: './owner-viewfeed.component.html',
  styleUrls: ['./owner-viewfeed.component.css']
})
export class OwnerViewfeedComponent implements OnInit {
  feeds: Feed[] = [];
  filteredFeeds: Feed[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 5;
  ownerLivestocks: any[] = [];
  livestockList: any[] = [];
  selectedFeedId: string = '';
  requestForm!: FormGroup;
  userId: string = JSON.parse(localStorage.getItem('userId') ?? '""');

  loading = true;
  showEmptyMessage = false;

  constructor(
    private readonly feedService: FeedService,
    private readonly livestockService: LivestockService,
    private readonly requestService: RequestService,
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly toastr: ToastrService
  ) { }

  ngOnInit(): void {
    const timeoutId = setTimeout(() => {
      if (this.loading && this.filteredFeeds.length === 0) {
        this.showEmptyMessage = true;
        this.loading = false;
      }
    }, 5000);

    this.feedService.getAllFeeds().subscribe((feed) => {
      this.feeds = feed;
      this.filteredFeeds = feed;

      if (feed.length > 0) {
        this.loading = false;
        this.showEmptyMessage = false;
        clearTimeout(timeoutId);
      } else {
        this.loading = false;
        this.showEmptyMessage = true;
      }
    });

    this.livestockService.getLivestockByUserIdowner(this.userId).subscribe((live) => {
      this.livestockList = live;
      this.ownerLivestocks = live.livestock;
    });

    this.requestForm = this.fb.group({
      livestock: ['', Validators.required],
      quantity: [null, [Validators.required, Validators.min(1)]]
    });
  }

  get paginatedFeeds(): Feed[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredFeeds.slice(start, start + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredFeeds.length / this.itemsPerPage);
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
      this.filteredFeeds = this.feeds;
    } else {
      this.filteredFeeds = this.feeds.filter((feed) =>
        feed.feedName.toLowerCase().startsWith(input.toLowerCase())
      );
    }
  }

  setSelectedFeed(feed: any) {
    this.selectedFeedId = feed._id;
    this.requestForm.reset();
  }

  confirmRequest() {
    if (this.requestForm.valid) {
      const requestData: Request = {
        itemType: 'Feed',
        itemId: this.selectedFeedId,
        userId: this.userId,
        quantity: this.requestForm.value.quantity,
        species: this.requestForm.value.livestock
      };
      this.requestService.addRequest(requestData).subscribe({
        next: () => {
          this.toastr.success('Request submitted successfully!');
          this.requestForm.reset();
        },
        error: (err) => {
          if (err.status === 400) {
            this.toastr.error(err.error.message);
          } else {
            this.toastr.error('Failed to submit request. Please try again.');
          }
        }
      });
    }
  }

  addFeedback(id: string) {
    this.router.navigate(['/owner/feedback'], { queryParams: { feed: id } });
  }
}