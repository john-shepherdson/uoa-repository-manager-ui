import { Pipe, PipeTransform } from '@angular/core';
import { RepositorySnippet } from '../../domain/typeScriptClasses';

@Pipe ({
  name: 'repoFilter'
})

export class RepoFilter implements PipeTransform {
  transform (items: RepositorySnippet[], searchTerm: string): any[] {
    if (!items) { return []; }
    if (!searchTerm) { return items; }

    searchTerm = searchTerm.trim();
    searchTerm = searchTerm.toLowerCase();

    return items.filter(
      repo => {
        return repo.officialname.toLowerCase().includes(searchTerm);
      }
    );
  }
}

