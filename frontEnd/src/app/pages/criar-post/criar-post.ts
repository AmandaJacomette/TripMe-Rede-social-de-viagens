import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sidebar } from '../../components/sidebar/sidebar';

@Component({
  selector: 'app-criar-post',
  standalone: true,
  imports: [Sidebar, CommonModule],
  templateUrl: './criar-post.html',
  styleUrl: './criar-post.scss'
})
export class CriarPost {

}
