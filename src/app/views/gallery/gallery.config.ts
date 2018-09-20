export class Constants {
	public static get GALLERY_URL(): string 
		{ return "https://api.github.com/repos/design-automation/mobius-gallery/contents/examples?ref=master"; 
	};

	public static get FILE_URL(): string { 
			return "https://raw.githubusercontent.com/design-automation/mobius-gallery/master/examples/";
	};
}