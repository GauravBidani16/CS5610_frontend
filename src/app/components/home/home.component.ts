import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { PrimeNGModule } from '../../shared/prime-ng/prime-ng.module';
import { PostService } from '../../services/post.service';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterModule, PrimeNGModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})

export class HomeComponent {
  posts: any[] = [];
  isLoggedIn = false;
  currentUserDetails: any = {};
  commentText: string = "";

  constructor(
    private postService: PostService,
    private authService: AuthService,
    private snackbarService: SnackbarService
  ) { }

  ngOnInit() {
    this.authService.isLoggedIn$.subscribe((status) => {
      this.isLoggedIn = status;
      this.activate();
    });
  }

  activate() {
    this.isLoggedIn = this.authService.isAuthenticated();
    this.currentUserDetails = this.authService.getUserDetails();
    this.fetchPublicPosts();
  }

  fetchPublicPosts() {
    this.postService.getPublicPosts().subscribe({
      next: (data) => {
        this.posts = data.data;
        if (this.isLoggedIn) {
          this.fetchFeedPosts()
        }
      },
      error: (err) => console.error("Error fetching public posts:", err)
    });
  }

  fetchFeedPosts() {
    this.postService.getFeedPosts().subscribe({
      next: (data) => {
        this.posts = [...data.data, ...this.posts];
        this.posts = this.posts.filter((post) => {
          post.comments = post.comments.filter((comment: any) => comment.author);
          return post.author
        });
        console.log(this.posts);
        
      },
      error: (err) => {
        console.error("Error fetching feed posts:", err)
        this.authService.logout();
      }
    });
  }

  likePost(postId: string) {
    if (!this.isLoggedIn) {
      this.snackbarService.show('You must be logged in to like a post');
      return;
    }
    this.postService.likePost(postId).subscribe({
      next: () => {
        const post = this.posts.find(p => p._id === postId);
        if (post) post.likes.push("currentUser");
      },
      error: (err) => {
        console.error("Error liking post:", err)
        this.snackbarService.show("Some error occurred while liking the post");
      }
    });
  }

  addComment(postId: string) {
    if (!this.isLoggedIn) {
      this.snackbarService.show('You must be logged in to comment on a post');
      // this.snackbarService.showInfo('Please log in to add comments');
      return;
    }
    this.postService.addComment(postId, this.commentText).subscribe({
      next: (comment) => {
        this.commentText = "";
        const post = this.posts.find(p => p._id === postId);
        if (post) post.comments.push({ author: { ...this.currentUserDetails }, text: comment.data.text });
      },
      error: (err) => console.error("Error adding comment:", err)
    });
  }

  showToast() {
    this.snackbarService.showToast("Test Toast msg");
  }

}
