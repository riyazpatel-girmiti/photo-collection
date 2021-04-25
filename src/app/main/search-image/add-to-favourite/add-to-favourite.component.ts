
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { ResourceService } from 'src/app/services/resource/resource.service';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { FavouriteService } from '../../../services/main/favourite/favourite.service';
import { Store, select } from '@ngrx/store';
import * as imageReducer from '../../../store/reducers/searchImage.reducer';
import { AddToCollection, createCollection, RemoveFromCollection } from 'src/app/store/actions/searchImage.actions';
import { NameExistsComponent } from 'src/app/share/name-exists/name-exists.component';


@Component({
  selector: 'app-add-to-favourite',
  templateUrl: './add-to-favourite.component.html',
  styleUrls: ['./add-to-favourite.component.css']
})
export class AddToFavouriteComponent implements OnInit {
  addImage = true;
  removeImage = false;
  tittle: any;
  imageList: any;
  createCollection = true;
  createCollecttonForm: FormGroup;
  collectionList: any;
  backgroundColor: string;
  createCollectionLabel: string;
  addToFavouriteFormUiConfig: {
    heading: string;
    close: string;
    add: string;
    remove: string;
    buttonText: string;
    imageAdd: string;
    imageRemove: string;
    collectionName: string;
    description: string;
    createcollection: string;
    cancel: string;
    createNewCollection: string;
    alertMessage: string;
  };
  // payload: collectionModel;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    private dailogRef: MatDialogRef<AddToFavouriteComponent>,
    private resourcesrv: ResourceService,
    private favouriteSrv: FavouriteService,
    private store: Store<any>,
    private dailog: MatDialog
  ) { }

  ngOnInit(): void {
    this.store.pipe(select(imageReducer.getCollection)).subscribe((data) => {
      this.collectionList = data;
      console.log(this.collectionList);
    });
    this.backgroundColor = 'greenBackColor';

    this.initResources();
    this.getImageDetails();
    this.initCollectionForm();

  }
  private initResources(): void {
    this.addToFavouriteFormUiConfig = {
      heading: this.resourcesrv.getConstValue('addcollectionpopup.heading.label'),
      close: this.resourcesrv.getConstValue('addcollectionpopup.close.icon'),
      add: this.resourcesrv.getConstValue('addcollectionpopup.add.icon'),
      remove: this.resourcesrv.getConstValue('addcollectionpopup.remove.icon'),
      buttonText: this.resourcesrv.getConstValue('addcollectionpopup.buttontext.text'),
      imageAdd: this.resourcesrv.getConstValue('addcollectionpopup.imageadd.text'),
      imageRemove: this.resourcesrv.getConstValue('addcollectionpopup.imageremove.text'),
      collectionName: this.resourcesrv.getConstValue('addcollectionpopup.Collectionname.text'),
      description: this.resourcesrv.getConstValue('addcollectionpopup.Description.text'),
      createcollection: this.resourcesrv.getConstValue('addcollectionpopup.button.Createcollection'),
      cancel: this.resourcesrv.getConstValue('addcollectionpopup.button.Cancel'),
      createNewCollection: this.resourcesrv.getConstValue('addcollectionpopup.create.collection.heading.label'),
      alertMessage: this.resourcesrv.getConstValue('addToFavourite.alertMsg')
    };
    this.createCollectionLabel = this.resourcesrv.getConstValue('addcollectionpopup.heading.label');
  }

  private initCollectionForm(): void {
    this.createCollecttonForm = new FormGroup({
      name: new FormControl('', [Validators.required, this.spaceValidator]),
      desc: new FormControl('')

    });

  }
  spaceValidator(control: AbstractControl): any {
    if (control && control.value && !control.value.replace(/\s/g, '').length) {
      control.setValue('');
      console.log(control.value);
      return { required: true };
    }
    else {
      return null;
    }
  }

  addOrRemovePhoto(collectionData): any {
    let imageRemoved = false;
    collectionData.imageArray.forEach(element => {
      if (this.data.id === element.id) {
        this.store.dispatch(new RemoveFromCollection(collectionData.name, element.id));
        imageRemoved = true;
      }
    });
    if (!imageRemoved) {
      this.store.pipe(select(imageReducer.getCollection)).subscribe((data) => {
        this.collectionList = data;
      });
      this.store.dispatch(new AddToCollection(this.data, collectionData.name));
      this.removeImage = true;
    }

  }
  removeclick(): void {
    this.removeImage = false;
    this.addImage = true;
  }
  getImageDetails(): void {
    if (this.data.length > 0) {
      this.imageList = this.data.urls.small;
      this.tittle = this.data.tags;
    }
  }
  CreateCollection(): void {
    this.createCollection = false;
    this.createCollectionLabel = this.resourcesrv.getConstValue('addcollectionpopup.create.collection.heading.label');

  }
  closeDialog(data): void {
    this.dailogRef.close();
  }

  collectionCreate(): void {
    let isCollectionNameExists = false;
    this.collectionList.forEach(item => {
      if (item.name === this.createCollecttonForm.value.name) {
        isCollectionNameExists = true;

      }
    });
    if (!(isCollectionNameExists)) {
      this.createCollection = true;
      this.store.dispatch(new createCollection(
        { name: this.createCollecttonForm.value.name, desc: this.createCollecttonForm.value.desc, imageArray: [] }));
      this.createCollecttonForm.reset();
      this.createCollectionLabel = this.resourcesrv.getConstValue('addcollectionpopup.heading.label');
    } else {
      this.dailog.open(NameExistsComponent, {
        width: '550px',
        disableClose: true,
        data: this.createCollecttonForm.value.name
      });

    }

  }

  cancelCreate(): void {
    this.createCollection = true;
    this.createCollectionLabel = this.resourcesrv.getConstValue('addcollectionpopup.heading.label');
    this.createCollecttonForm.reset();
  }

  addImageToCollection(item): boolean {
    let isaddedd = false;
    item.imageArray.forEach(element => {
      if (this.data.id === element.id) {
        isaddedd = true;
      }
    });
    return isaddedd;
  }
}
