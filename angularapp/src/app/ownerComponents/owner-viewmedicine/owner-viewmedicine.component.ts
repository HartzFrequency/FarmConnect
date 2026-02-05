import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Medicine } from 'src/app/models/medicine.model';
import { Request } from 'src/app/models/request.model';
import { LivestockService } from 'src/app/services/livestock.service';
import { MedicineService } from 'src/app/services/medicine.service';
import { RequestService } from 'src/app/services/request.service';

@Component({
  selector: 'app-owner-viewmedicine',
  templateUrl: './owner-viewmedicine.component.html',
  styleUrls: ['./owner-viewmedicine.component.css']
})
export class OwnerViewmedicineComponent implements OnInit, OnDestroy {
  medicines: Medicine[] = [];
  filteredMedicnes: Medicine[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 5;

  ownerLivestocks: any[] = [];
  livestockList: any[] = []; 
  selectedMedicineId: string = ''; 
  requestForm!: FormGroup;
  userId: string = JSON.parse(localStorage.getItem('userId') ?? '""');

  loading = true;
  showEmptyMessage = false;

  subscriptions: Subscription[] = [];

  constructor(
    private readonly medicineService: MedicineService,
    private readonly livestockService: LivestockService,
    private readonly requestService: RequestService,
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly toastr: ToastrService
  ) {}

  ngOnInit(): void {
    const timeoutId = setTimeout(() => {
      if (this.loading && this.filteredMedicnes.length === 0) {
        this.showEmptyMessage = true;
        this.loading = false;
      }
    }, 5000); 

    this.subscriptions.push(
      this.medicineService.getAllMedicine().subscribe((value) => {
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

    this.subscriptions.push(
      this.livestockService.getLivestockByUserIdowner(this.userId).subscribe((data) => {
        this.livestockList = data;
        this.ownerLivestocks = data.livestock;
      })
    );

    this.requestForm = this.fb.group({
      livestock: ['', Validators.required],
      quantity: [null, [Validators.required, Validators.min(1)]]
    });
  }

  get paginatedMedicine(): Medicine[] {
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
      this.filteredMedicnes = this.medicines.filter((medicine) =>
        medicine.medicineName.toLowerCase().startsWith(input.toLowerCase())
      );
    }
  }

  setSelectedMedicine(medicine: any) {
    this.selectedMedicineId = medicine._id;
    this.requestForm.reset();
  }

  confirmRequest() {
    if (this.requestForm.valid) {
      const requestData: Request = {
        itemType: 'Medicine',
        itemId: this.selectedMedicineId,
        userId: this.userId,
        species: this.requestForm.value.livestock,
        quantity: this.requestForm.value.quantity
      };
      this.requestService.addRequest(requestData).subscribe({
        next: () => {
          this.toastr.success('Request submitted successfully!');
          this.requestForm.reset();
        },
        error: (err) => {
          if (err.status === 400) {
            this.toastr.error('Failed to submit request', err.error.message);
          } else {
            this.toastr.error('Failed to submit request. Please try again.');
          }
        }
      });
    }
  }

  addFeedback(id: string) {
    this.router.navigate(['owner/feedback'], { queryParams: { medicine: id } });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}