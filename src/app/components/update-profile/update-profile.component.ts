import { Component } from '@angular/core';
import { DialogService, DynamicDialogComponent, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PrimeNGModule } from '../../shared/prime-ng/prime-ng.module';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-update-profile',
  imports: [ReactiveFormsModule, PrimeNGModule],
  templateUrl: './update-profile.component.html',
  styleUrl: './update-profile.component.scss',
  providers: [DialogService],
})
export class UpdateProfileComponent {
  public roles = ["PUBLIC_USER", "PRIVATE_USER"];
  instance: DynamicDialogComponent | undefined;

  updateUserForm = new FormGroup({
    firstname: new FormControl('', Validators.required),
    lastname: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    role: new FormControl('', Validators.required),
    bio: new FormControl('', Validators.maxLength(500)),
  });

  constructor(
    // private dialogService: DialogService, 
    private ref: DynamicDialogRef,
    public config: DynamicDialogConfig
  ) {
    // this.instance = this.dialogService.getInstance(this.ref);
  }

  ngOnInit() {
    const currentUserData = this.config.data?.currentUserData;

    if (currentUserData) {
      this.updateUserForm.patchValue({
        firstname: currentUserData.firstname,
        lastname: currentUserData.lastname,
        email: currentUserData.email,
        role: currentUserData.role,
        bio: currentUserData.bio
      });
    }
    
  }
  
  closeDialog() {
    this.ref.close(this.updateUserForm?.value);
  }

  close() {
    this.ref.close();
  }
  
}
