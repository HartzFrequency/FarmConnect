import { Component, OnInit, OnDestroy } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { RequestService } from 'src/app/services/request.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-view-request',
  templateUrl: './view-request.component.html',
  styleUrls: ['./view-request.component.css']
})
export class ViewRequestComponent implements OnInit, OnDestroy {
  requests: any[] = [];
  filteredRequests: any[] = [];
  supplierId: string = JSON.parse(localStorage.getItem('userId') ?? '""');
  currentPage: number = 1;
  itemsPerPage: number = 5;

  loading = true;
  showEmptyMessage = false;
  subscriptions: Subscription[] = [];

  constructor(
    private readonly requestService: RequestService,
    private readonly toastr: ToastrService
  ) {}

  ngOnInit(): void {
    const timeoutId = setTimeout(() => {
      if (this.loading && this.filteredRequests.length === 0) {
        this.showEmptyMessage = true;
        this.loading = false;
      }
    }, 5000);

    this.loadRequests(timeoutId);
  }

  loadRequests(timeoutId?: any): void {
    const sub = this.requestService.getRequestsBySupplier(this.supplierId).subscribe({
      next: (data) => {
        this.requests = data;
        this.filteredRequests = data;
        this.filteredRequests.reverse()

        if (data.length > 0) {
          this.loading = false;
          this.showEmptyMessage = false;
          if (timeoutId) clearTimeout(timeoutId);
        } else {
          this.loading = false;
          this.showEmptyMessage = true;
        }
      },
      error: () => {
        this.loading = false;
        this.showEmptyMessage = true;
        this.toastr.error('Failed to load requests. Please try again.');
      }
    });

    this.subscriptions.push(sub);
  }

  approveRequest(id: string): void {
    const sub = this.requestService.updateRequest(id, { status: 'Approved' }).subscribe({
      next: () => {
        this.toastr.success('Request updated successfully!');
        this.loadRequests();
      },
      error: (err) => {
        if (err.status === 400) {
          this.toastr.error(err.error.message);
        } else {
          this.toastr.error('Failed to update request. Please try again.');
        }
      }
    });
    this.subscriptions.push(sub);
  }

  rejectRequest(id: string): void {
    const sub = this.requestService.updateRequest(id, { status: 'Rejected' }).subscribe({
      next: () => {
        this.toastr.success('Request updated successfully!');
        this.loadRequests();
      },
      error: () => {
        this.toastr.error('Cannot update request');
      }
    });
    this.subscriptions.push(sub);
  }

  search(event: any): void {
    const input = event.target.value;
    if (!input) {
      this.filteredRequests = this.requests;
    } else {
      this.filteredRequests = this.requests.filter((req) => {
        const name = req.itemId?.feedName ?? req.itemId?.medicineName ?? '';
        return name.toLowerCase().startsWith(input.toLowerCase());
      });
    }
  }

  get paginatedRequests(): any[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredRequests.slice(start, start + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredRequests.length / this.itemsPerPage);
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

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}