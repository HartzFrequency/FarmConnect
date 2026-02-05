import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Medicine } from 'src/app/models/medicine.model';
import { MedicineService } from 'src/app/services/medicine.service';

@Component({
  selector: 'app-add-medicine',
  templateUrl: './add-medicine.component.html',
  styleUrls: ['./add-medicine.component.css']
})
export class AddMedicineComponent implements OnInit {
  medicineForm!: FormGroup;
  formSubmitted: boolean = false;
  supplierId: string = JSON.parse(localStorage.getItem('userId'));
  currentId?: string;
  currentMed?: Medicine;
  constructor(private readonly fb: FormBuilder, private readonly route: ActivatedRoute, private readonly MedicineService: MedicineService, private readonly toastr: ToastrService, private readonly datePipe: DatePipe, private readonly router: Router) {
    this.medicineForm = this.fb.group({
      medicineName: ['', Validators.required],
      type: ['', Validators.required],
      description: ['', Validators.required],
      dosage: ['', Validators.required],
      pricePerUnit: [null, Validators.required],
      unit: ['', Validators.required],
      availableUnits: [null, Validators.required],
      manufacturer: ['', Validators.required],
      expiryDate: ['', Validators.required]
    })
  }
  ngOnInit(): void {
    this.currentId = this.route.snapshot.params.id;
    if (this.currentId) {
      this.MedicineService.getMedicineById(this.currentId).subscribe((value) => {
        if (value.expiryDate) {
          value.expiryDate = this.datePipe.transform(value.expiryDate, 'yyyy-MM-dd');
        }
        this.medicineForm.patchValue(value);
      })
    }
  }

  onSubmit() {
    this.formSubmitted = true;
    if (this.medicineForm.valid) {
      const payload = { ...this.medicineForm.value, supplierId: this.supplierId };
      if (this.currentId) {
        this.MedicineService.updateMedicine(this.currentId, payload).subscribe({
          next: (value) => {
            this.toastr.success("Medicine updated Successfully");
            this.medicineForm.reset();
            this.formSubmitted = false;
            this.router.navigate(['/supplier/view-medicine']);
          },
          error: (err) => {
            this.toastr.error(err);
          }
        })
      } else {
        this.MedicineService.addMedicine(payload).subscribe({
          next: (value) => {
            this.toastr.success("New Medicine added Successfully");
            this.medicineForm.reset();
            this.formSubmitted = false;
            this.router.navigate(['/supplier/view-medicine']);
          },
          error: (err) => {
            this.toastr.error(err);
          }
        })
      }
    } else {
      this.toastr.error('Please fill all required fields correctly.');
    }
  }
}
