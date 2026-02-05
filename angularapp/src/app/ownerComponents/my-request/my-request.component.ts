import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Request } from 'src/app/models/request.model';
import { RequestService } from 'src/app/services/request.service';

@Component({
  selector: 'app-my-request',
  templateUrl: './my-request.component.html',
  styleUrls: ['./my-request.component.css']
})
export class MyRequestComponent implements OnInit {
  requests: any[] = [];
  filteredRequests: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 5;

  loading = true;
  showEmptyMessage = false;

  ownerId = JSON.parse(localStorage.getItem('userId') || '""');

  constructor(
    private readonly requestService: RequestService,
    private readonly router: Router,
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

  loadRequests(timeoutId: any) {
    this.requestService.getRequestsByUserId(this.ownerId).subscribe((val) => {
      this.requests = val;
      this.filteredRequests = val;

      if (val.length > 0) {
        this.loading = false;
        this.showEmptyMessage = false;
        clearTimeout(timeoutId);
      } else {
        this.loading = false;
        this.showEmptyMessage = true;
      }
    });
  }

  deleteRequest(id: string) {
    this.requestService.deleteRequest(id).subscribe(() => {
      this.toastr.success('Request deleted successfully!');
      this.loadRequests(null);
    });
  }

  get paginatedRequests(): Request[] {
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

  search(event: any) {
    const input = event.target.value;
    if (!input) {
      this.filteredRequests = this.requests;
    } else {
      this.filteredRequests = this.requests.filter((req) =>
        req.itemId.feedName
          ? req.itemId.feedName.toLowerCase().startsWith(input.toLowerCase())
          : req.itemId.medicineName.toLowerCase().startsWith(input.toLowerCase())
      );
    }
  }
}