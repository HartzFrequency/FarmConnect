import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Feed } from 'src/app/models/feed.model';
import { FeedService } from 'src/app/services/feed.service';

@Component({
  selector: 'app-view-feed',
  templateUrl: './view-feed.component.html',
  styleUrls: ['./view-feed.component.css']
})
export class ViewFeedComponent implements OnInit, OnDestroy {
  feeds: Feed[] = [];
  filteredFeeds: Feed[] = [];
  subscriptions: Subscription[] = [];
  supplierId: string = JSON.parse(localStorage.getItem('userId') ?? '""');
  currentPage: number = 1;
  itemsPerPage: number = 5;

  loading = true;
  showEmptyMessage = false;

  constructor(
    private readonly feedService: FeedService,
    private readonly router: Router,
    private readonly toastr: ToastrService
  ) {}

  ngOnInit(): void {
    const timeoutId = setTimeout(() => {
      if (this.loading && this.filteredFeeds.length === 0) {
        this.showEmptyMessage = true;
        this.loading = false;
      }
    }, 5000);

    this.loadFeeds(timeoutId);
  }

  loadFeeds(timeoutId?: any) {
    this.subscriptions.push(
      this.feedService.getFeedBySupplierId(this.supplierId).subscribe((value) => {
        this.feeds = value;
        this.filteredFeeds = value;

        if (value.length > 0) {
          this.loading = false;
          this.showEmptyMessage = false;
          clearTimeout(timeoutId);
        } else {
          this.loading = false;
          this.showEmptyMessage = true;
        }
      })
    );
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

  editFeed(id: string) {
    this.router.navigate([`/supplier/add-feed/${id}`]);
  }

  removeFeed(id: string) {
    this.subscriptions.push(
      this.feedService.deleteFeed(id, {}).subscribe({
        next: () => {
          this.loadFeeds();
          this.toastr.success('Feed deleted successfully!');
        },
        error: (err) => {
          this.toastr.error(err.error.message);
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
