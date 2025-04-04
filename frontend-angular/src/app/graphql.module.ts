import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { provideApollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client/core';
import { inject } from '@angular/core';

@NgModule({
  imports: [HttpClientModule],
  providers: [
    provideApollo(() => {
      
      const httpLink = inject(HttpLink);
      return {
        link: httpLink.create({ uri: 'http://localhost:5001/graphql' }),
        cache: new InMemoryCache(),
      };
    }),
  ],
})
export class GraphQLModule {}
