import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { PrimeNGModule } from '../../shared/prime-ng/prime-ng.module';
import { PostService } from '../../services/post.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterModule, PrimeNGModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  posts: any[] = [];

  constructor(private postService: PostService) {}

  ngOnInit() {
    this.fetchPublicPosts();
  }

  fetchPublicPosts() {
    this.postService.getPublicPosts().subscribe({
      next: (data) => {
        this.posts = data.data;
      },
      error: (err) => console.error("Error fetching public posts:", err)
    });
  }

  likePost(postId: string) {
    this.postService.likePost(postId).subscribe({
      next: () => {
        const post = this.posts.find(p => p._id === postId);
        if (post) post.likes.push('currentUser'); // Mock update for instant UI response
      },
      error: (err) => console.error("Error liking post:", err)
    });
  }

  addComment(postId: string, text: string) {
    this.postService.addComment(postId, text).subscribe({
      next: (comment) => {
        const post = this.posts.find(p => p._id === postId);
        if (post) post.comments.push(comment);
      },
      error: (err) => console.error("Error adding comment:", err)
    });
  }

}
