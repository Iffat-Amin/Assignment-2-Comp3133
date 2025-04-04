import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';

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

@Component({
  selector: 'app-employee-details',
  standalone: false,
  templateUrl: './employee-details.component.html',
  styleUrl: './employee-details.component.css'
})
export class EmployeeDetailsComponent implements OnInit {
  employee: any;
  loading = true;
  error: any;

  constructor(private route: ActivatedRoute, private apollo: Apollo) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    this.apollo.watchQuery({
      query: GET_EMPLOYEE_BY_ID,
      variables: { id }
    }).valueChanges.subscribe({
      next: ({ data, loading }: any) => {
        this.employee = data.employee;
        this.loading = loading;
      },
      error: (err) => {
        this.error = err;
      }
    });
  }
}
