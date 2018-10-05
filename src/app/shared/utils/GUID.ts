export abstract class IdGenerator{
	
	private static s4(): string{
	    return Math.floor((1 + Math.random()) * 0x10000)
	      .toString(16)
	      .substring(1);
	}

	static getId(): string{
	  return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' +
	    this.s4() + '-' + this.s4() + this.s4() + this.s4();
	}
}