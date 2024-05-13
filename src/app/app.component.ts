import { AfterViewInit, Component, OnInit, Renderer2, RendererFactory2, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, AfterViewInit {
  private renderer: Renderer2;
  private library = inject(FaIconLibrary);

  // Constructor to inject RendererFactory2
  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  title = 'chatbot';
  colorTheme = 'light-mode';

  ngOnInit(): void {
    // Initialize icon packs
    this.library.addIconPacks(fas);
  }

  // AfterViewInit lifecycle hook
  ngAfterViewInit() {
    this.removeThemes();
    this.renderer.addClass(document.body, this.colorTheme);
  }

  // Method to remove existing color themes
  removeThemes() {
    this.renderer.removeClass(document.body, 'light-mode');
    this.renderer.removeClass(document.body, 'dark-mode');
  }
}
