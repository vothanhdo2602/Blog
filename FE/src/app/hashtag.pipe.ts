import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'hashtag'
})
export class HashtagPipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) {}

  transform(text: string){
    return this.sanitizer.bypassSecurityTrustHtml(text);
  }

}
