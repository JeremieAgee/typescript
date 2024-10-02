export class User {
	username: string;
	email: string;
	id?: number;
	constructor( username: string, email: string, id?: number) {
		this.id = id;
        this.username = username;
		this.email = email
	}
	updateUser = (user: User)=>{
		if(user.id===this.id){
			this.username = user.username;
			this.email = user.email;
		}

	}
}
