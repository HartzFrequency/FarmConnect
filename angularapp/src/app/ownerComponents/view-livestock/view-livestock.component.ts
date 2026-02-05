import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Livestock } from 'src/app/models/livestock.model';
import { LivestockService } from 'src/app/services/livestock.service';

@Component({
  selector: 'app-view-livestock',
  templateUrl: './view-livestock.component.html',
  styleUrls: ['./view-livestock.component.css']
})
export class ViewLivestockComponent implements OnInit {
  liveStock: Livestock[] = [];
  filteredliveStock: Livestock[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 5;

  @ViewChild('livestockModal') livestockModal!: TemplateRef<any>;
  selectedLivestock: any = null;

  userId = JSON.parse(localStorage.getItem('userId') || '""');

  loading = true;
  showEmptyMessage = false;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly service: LivestockService,
    private readonly toastr: ToastrService,
    private readonly dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const timeoutId = setTimeout(() => {
      if (this.loading && this.filteredliveStock.length === 0) {
        this.showEmptyMessage = true;
        this.loading = false;
      }
    }, 5000);

    this.getById(timeoutId);
  }

  getById(timeoutId: any) {
    this.service.getLivestockByUserId(this.userId).subscribe((value) => {
      this.liveStock = value.livestock;
      this.filteredliveStock = value.livestock;

      if (this.filteredliveStock.length > 0) {
        this.loading = false;
        this.showEmptyMessage = false;
        clearTimeout(timeoutId);
      } else {
        this.loading = false;
        this.showEmptyMessage = true;
      }
    });
  }

  searchBy(event: any) {
    if (event.target.value) {
      this.filteredliveStock = this.liveStock.filter((i) =>
        i.name.toLowerCase().includes(event.target.value.toLowerCase())
      );
    } else {
      this.filteredliveStock = this.liveStock;
    }
  }

  get paginatedliveStock(): Livestock[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredliveStock.slice(start, start + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredliveStock.length / this.itemsPerPage);
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

  editLivestock(id: number) {
    this.router.navigate([`/owner/livestock-form/${id}`]);
  }

  deleteLivestock(id: any) {
    this.service.deleteLivestock(id).subscribe({
      next: () => {
        this.toastr.success('Livestock Deleted Successfully');
        this.getById(null);
      },
      error: () => {
        this.toastr.error('Failed to delete');
      }
    });
  }

  openLivestockDetail(item: Livestock) {
    this.selectedLivestock = item;
    this.dialog.open(this.livestockModal, {
      width: '500px',
      panelClass: 'custom-dialog-container'
    });
  }

  closeModal() {
    this.dialog.closeAll();
  }
}