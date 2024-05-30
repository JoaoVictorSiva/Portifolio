import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { StorageService } from '../../services/storage.service';
import { User } from '../../models/user';
import { of, switchMap } from 'rxjs';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  imports: [CommonModule, IonicModule, FormsModule],
  standalone: true,
})
export class UsersComponent implements OnInit {
  newUserName = '';
  newUserCidade = '';
  newUserEmail = '';
  userList: User[] = [];
  isWeb: any;

  constructor(private storage: StorageService) {}

  ngOnInit() {
    try {
      this.storage.userState().pipe(
        switchMap(res => {
          if (res) {
            return this.storage.fetchUsers();
          } else {
            return of([]); // Return an empty array when res is false
          }
        })
      ).subscribe(data => {
        this.userList = data.map(user => ({
          ...user,
          isEditing: false,
          editName: user.name,
          editCidade: user.cidade,
          editEmail: user.email
        })); // Update the user list when the data changes
      });

    } catch(err) {
      throw new Error(`Error: ${err}`);
    }
  }

  async createUser() {
    await this.storage.addUser(this.newUserName, this.newUserCidade, this.newUserEmail);
    this.newUserName = '';
    this.newUserCidade = '';
    this.newUserEmail = '';
    console.log(this.userList, '#users');
  }

  updateUser(user: User) {
    const active = user.active === 0 ? 1 : 0;
    this.storage.updateUserById(user.id.toString(), active);
  }

  deleteUser(user: User) {
    this.storage.deleteUserById(user.id.toString());
  }

  editUser(user: User) {
    user.isEditing = true;
  }

  async saveUser(user: User) {
    user.isEditing = false;
    if (user.name !== user.editName || user.cidade !== user.editCidade || user.email !== user.editEmail) {
      await this.storage.updateUserDetailsById(user.id.toString(), user.editName, user.editCidade, user.editEmail);
    }
  }
}
