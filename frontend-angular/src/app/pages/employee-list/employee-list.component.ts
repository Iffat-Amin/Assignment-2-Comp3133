import { Component, OnInit } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';

const GET_EMPLOYEES = gql`
  query {
    employees {
      id
      name
      position
      department
      salary
      profilePicture
    }
  }
`;

const DELETE_EMPLOYEE = gql`
  mutation DeleteEmployee($id: String!) {
    deleteEmployee(id: $id) {
      id
    }
  }
`;
const SEARCH_EMPLOYEES = gql`
  query SearchEmployees($department: String, $position: String) {
    searchEmployees(department: $department, position: $position) {
      id
      name
      position
      department
      salary
      profilePicture
    }
  }
`;


@Component({
  selector: 'app-employee-list',
  standalone: false,
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.css'
})
export class EmployeeListComponent implements OnInit {
  readonly backendBaseUrl = 'https://assignment-2-comp3133back.onrender.com';

  employees: any[] = [];
  loading = true;
  error: any;
  searchDept: string = '';
  searchPos: string = '';
  successMessage: string = '';

  constructor(private apollo: Apollo) {}

  ngOnInit(): void {
    this.fetchEmployees();
  }

  fetchEmployees(): void {
    this.apollo.watchQuery<any>({
      query: GET_EMPLOYEES,
      fetchPolicy: 'network-only' 
    }).valueChanges.subscribe({
      next: ({ data, loading }) => {
        this.employees = data.employees;
        this.loading = loading;
      },
      error: (err) => {
        this.error = err;
      }
    });
  }

  deleteEmployee(id: string): void {
    const confirmDelete = confirm('Are you sure you want to delete this employee?');

    if (confirmDelete) {
      this.apollo.mutate({
        mutation: DELETE_EMPLOYEE,
        variables: { id }
      }).subscribe({
        next: () => {
          this.fetchEmployees(); 
        },
        error: (err) => {
          console.error('Error deleting employee:', err);
        }
      });
    }
  }
  viewEmployee(id: string): void {
    // Navigate to details page
    window.location.href = `/employee/${id}`;
  }
  
  editEmployee(id: string): void {
    // Navigate to edit page
    window.location.href = `/employee/edit/${id}`;
  }

  onSearch(): void {
    this.apollo.watchQuery<any>({
      query: SEARCH_EMPLOYEES,
      variables: {
        department: this.searchDept,
        position: this.searchPos
      },
      fetchPolicy: 'network-only'
    }).valueChanges.subscribe({
      next: ({ data }) => {
        this.employees = data.searchEmployees; // ✅ Assign results
      },
      error: (err) => {
        console.error('Search error:', err);
      }
    });
  }
  
  
  resetSearch(): void {
    this.searchDept = '';
    this.searchPos = '';
    this.fetchEmployees(); // reload full list
  }
}

