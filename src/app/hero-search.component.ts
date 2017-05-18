import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import 'rxjs/add/observable/of';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

import { HeroSearchService } from './hero-search.service';
import { Hero } from './hero';

@Component({
	selector: 'hero-search',
	templateUrl: './hero-search.component.html',
	styleUrls: ['./hero-search.component.css'],
	providers: [HeroSearchService]
})
export class HeroSearchComponent implements OnInit {
	heroes: Observable<Hero[]>;
	private searchTerm = new Subject<string>();

	constructor(
		private heroSearchService: HeroSearchService,
		private router: Router) {
		// code...
	}

	search(term: string): void {
		this.searchTerm.next(term);
	}

	ngOnInit(): void {
		this.heroes = this.searchTerm
			.debounceTime(300) // wait 300ms after each keystroke before considering the term
			.distinctUntilChanged() // ignore if next search term is same as previous
			.switchMap(term => term 
				? this.heroSearchService.search(term)
				: Observable.of<Hero[]>([]))
			.catch(error => {
				console.log(error);
				return Observable.of<Hero[]>([]);
			});
	}

	gotoDetail(hero: Hero): void {
		let link = ['/detail', hero.id];
		this.router.navigate(link);
	}
}