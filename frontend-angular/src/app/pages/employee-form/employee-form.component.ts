import { Component , OnInit } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { ActivatedRoute, Router } from '@angular/router';


const ADD_EMPLOYEE = gql`
  mutation AddEmployee($name: String!, $position: String!, $department: String!, $salary: Int!, $profilePicture: String) {
    addEmployee(name: $name, position: $position, department: $department, salary: $salary, profilePicture: $profilePicture) {
      id
      name
    }
  }
`;
const GET_EMPLOYEE_BY_ID = gql`
  query GetEmployee($id: String!) {
    employee(id: $id) {
      id
      name
      position
      department
      salary
      profilePicture
    }
  }
`;

const UPDATE_EMPLOYEE = gql`
  mutation UpdateEmployee($id: String!, $name: String, $position: String, $department: String, $salary: Int, $profilePicture: String) {
    updateEmployee(id: $id, name: $name, position: $position, department: $department, salary: $salary, profilePicture: $profilePicture) {
      id
    }
  }
`;


@Component({
  selector: 'app-employee-form',
  standalone: false,
  templateUrl: './employee-form.component.html',
  styleUrl: './employee-form.component.css'
})
export class EmployeeFormComponent implements OnInit {
  name = '';
  position = '';
  department = '';
  salary: number | null = null;
  profilePicture: File | null = null;
  imagePreview: string = '';
  uploading = false;
  isEditMode = false;
  employeeId: string | null = null;
  successMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private apollo: Apollo,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.employeeId = this.route.snapshot.paramMap.get('id');
    if (this.employeeId) {
      this.isEditMode = true;
      this.fetchEmployee();
    }
  }

  fetchEmployee(): void {
    this.apollo.watchQuery<any>({
      query: GET_EMPLOYEE_BY_ID,
      variables: { id: this.employeeId }
    }).valueChanges.subscribe(({ data }) => {
      const emp = data.employee;
      this.name = emp.name;
      this.position = emp.position;
      this.department = emp.department;
      this.salary = emp.salary;
      this.imagePreview = emp.profilePicture;
    });
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.profilePicture = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  async uploadImage(): Promise<string | null> {
    if (!this.profilePicture) return this.imagePreview || null;

    const formData = new FormData();
    formData.append('profile', this.profilePicture);

    const response = await fetch('http://localhost:5001/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) throw new Error('Image upload failed');
    const result = await response.json();
    return result.imageUrl;
  }

  async onSubmit(): Promise<void> {
    this.uploading = true;
  
    try {
      const profileUrl = await this.uploadImage();
  
      const variables = {
        name: this.name,
        position: this.position,
        department: this.department,
        salary: this.salary,
        profilePicture: profileUrl
      };
  
      if (this.isEditMode && this.employeeId) {
        this.apollo.mutate({
          mutation: UPDATE_EMPLOYEE,
          variables: { id: this.employeeId, ...variables }
        }).subscribe(() => {
          this.successMessage = 'Employee updated successfully! ✅';
          setTimeout(() => {
            this.router.navigate(['/employees']);
          }, 1500);
        });
      } else {
        // ✅ ADD EMPLOYEE MUTATION
        this.apollo.mutate({
          mutation: ADD_EMPLOYEE,
          variables
        }).subscribe(() => {
          this.successMessage = 'Employee added successfully! ✅';
          setTimeout(() => {
            this.router.navigate(['/employees']);
          }, 1500);
        });
      }
    } catch (err) {
      console.error('Error in onSubmit:', err);
    } finally {
      this.uploading = false;
    }
  }
  
}
