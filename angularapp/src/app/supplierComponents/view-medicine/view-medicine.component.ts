import { Component, OnDestroy, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Medicine } from 'src/app/models/medicine.model';
import { MedicineService } from 'src/app/services/medicine.service';

@Component({
  selector: 'app-view-medicine',
  templateUrl: './view-medicine.component.html',
  styleUrls: ['./view-medicine.component.css']
})
export class ViewMedicineComponent implements OnInit, OnDestroy {
  medicines: Medicine[] = [];
  filteredMedicnes: Medicine[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 5;
  supplierId: string = JSON.parse(localStorage.getItem('userId') ?? '""');
  subscriptions: Subscription[] = [];

  loading = true;
  showEmptyMessage = false;

  constructor(
    private readonly medicineService: MedicineService,
    private readonly toastr: ToastrService
  ) {}

  ngOnInit(): void {
    const timeoutId = setTimeout(() => {
      if (this.loading && this.filteredMedicnes.length === 0) {
        this.showEmptyMessage = true;
        this.loading = false;
      }
    }, 5000);

    this.loadMedicines(timeoutId);
  }

  loadMedicines(timeoutId?: any) {
    this.subscriptions.push(
      this.medicineService.getMedicineBySupplierId(this.supplierId).subscribe((value) => {
        this.medicines = value;
        this.filteredMedicnes = value;

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

  deleteMed(id: string) {
    this.subscriptions.push(
      this.medicineService.deleteMedicine(id, {}).subscribe({
        next: () => {
          this.toastr.success('Medicine Deleted Successfully!');
          this.loadMedicines();
        },
        error: (err) => {
          this.toastr.error(err.error.message);
        }
      })
    );
  }

  get paginatedMedicines(): Medicine[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredMedicnes.slice(start, start + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredMedicnes.length / this.itemsPerPage);
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
      this.filteredMedicnes = this.medicines;
    } else {
      this.filteredMedicnes = this.medicines.filter((med) =>
        med.medicineName.toLowerCase().startsWith(input.toLowerCase())
      );
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}