export class User {
	username: string;
	email: string;
	id?: string;
	constructor(username: string, email: string, id?: string) {
		this.id = id ?? "";
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
