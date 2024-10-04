export class User {
	id: number;
	username: string;
	email: string;
	uid: string;
	constructor(username: string, email: string, uid: string, id?: number) {
		this.uid = uid ?? "";
		this.username = username;
		this.email = email;
		this.id = id ?? 0;
	}
	updateUser = (user: User) => {
		if (user.uid === this.uid) {
			this.username = user.username;
			this.email = user.email;
		}
	};
}
