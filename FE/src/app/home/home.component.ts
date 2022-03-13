import { Component, HostListener, OnInit, ElementRef } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { ApiService } from 'src/services/api.service';
import { TextAreaComponent } from '../text-area/text-area.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public title;
  public content;
  public query = {
    tag: '',
    title: ''
  };
  public currentUser: any = {};
  private page: number = 1;
  public posts: any[] = [];
  public post: any = {
    title: '',
    content: '',
    tags: [],
  }
  public comments: any = [];

  constructor(private dialog: MatDialog, private activedRoute: ActivatedRoute, private route: Router, private apiService: ApiService, private elementRef: ElementRef) { return;}

  ngOnInit(): void {
    this.query.tag = this.activedRoute.snapshot.queryParams['tag'];
    this.query.title = this.activedRoute.snapshot.queryParams['title']
    if (localStorage.getItem('User')){
      this.currentUser = JSON.parse(localStorage.getItem('User') || '{}');
    }
    else {
      this.route.navigate(['./login']);
    }
    if (this.query.tag){
      console.log(111111)
    }
    else if (this.query.title){
      console.log(111111)
    }
    else {
      this.getPage();
    }
  }

  ngAfterViewChecked (){
    if(this.elementRef.nativeElement.querySelector('.hashtag')){
      this.elementRef.nativeElement.querySelector('.hashtag').addEventListener('click', this.searchByTag);
    }
  } 

  @HostListener("window:scroll", ["$event"])
  onWindowScroll() {
    if(document.documentElement.scrollHeight - document.documentElement.scrollTop == document.documentElement.clientHeight ){
      this.page++;
      this.getPage();
    }
  }

  getPage(){
    this.apiService.getPage(this.page).subscribe( res => {
      if (!res.posts.length && this.page > 1){
        this.page--
        return;
      }
      this.processData(res)
    });
  }

  editComment(i, j): void {
    const dialogRef = this.dialog.open(TextAreaComponent, {
      width: 'auto',
      data: this.posts[i].comments[j],
    });

    dialogRef.afterClosed().subscribe( data => {
      let body = {
        _id: data._id,
        content: data.content
      }
      this.apiService.updateComment(body).subscribe( res => {
        if (res.status == 'OK'){
          return;
        }
      })
    });
  }

  editPost(i): void {
    const dialogRef = this.dialog.open(TextAreaComponent, {
      width: 'auto',
      data: this.posts[i],
    });

    dialogRef.afterClosed().subscribe( data => {
      let body = {
        _id: data._id,
        content: data.content
      }
      this.apiService.updateComment(body).subscribe( res => {
        if (res.status == 'OK'){
          return;
        }
      })
    });
  }

  deleteComment(i, j){
    let body = { _id: this.posts[i].comments[j]._id };
    if (confirm('Click OK to delete this')){
      this.apiService.deleteComment(body).subscribe( res => {
        if (res.status == 'OK'){
          this.posts[i].comments.splice(j, 1);
        }
      })
    }
  }

  deletePost(i){
    let body = { _id: this.posts[i]._id };
    this.apiService.deletePost(body).subscribe( res => {
      if (res.status == 'OK'){
        this.posts.splice(i, 1);
      }
    })
  }

  processData(res){
    if (res){
      this.page++;
      this.posts = res.posts;
      this.posts.forEach( el => {
        el.content = el.content.replace(/\#[^ ]+/g, '<a class="hashtag" href="http://localhost:4200/home?tag=$&">$&</a>');
        el.createdAt = el.createdAt.replace(/[.].+|T/g, ' ');
        el.comments.forEach( el => {
          el.createdAt = el.createdAt.replace(/[.].+|T/g, ' ');
        })
        this.comments.push('');
      })
    }
  }

  logout(){
    this.currentUser = {};
    localStorage.clear();
    this.route.navigate(['./login']);
  }

  searchByTag = (event) =>{
    let tag = event.target.innerHTML;
    this.apiService.searchByTag(tag).subscribe( res => this.processData(res) )
  }

  createPost(){
    if (this.post.title && this.post.content){
      let tags = this.post.content.match(/\#[^ ]+/g);
      this.post.tags = tags;
      this.apiService.createPost(this.post).subscribe( res => {
        this.posts = res.posts;
      })
    }
  }

  searchByTitle(){
    this.apiService.searchByTitle(this.title).subscribe( res => {
      this.processData(res);
    })
  }

  createComment(i) {
    let body = {
      post: this.posts[i]._id,
      content: this.comments[i]
    }
    this.apiService.createComment(body).subscribe( res => {
      this.posts[i].comments = res.comments;
    })
  }

}
