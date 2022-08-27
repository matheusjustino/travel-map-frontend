// INTERFACES
import { UserInterface } from "./user.interface";

export interface PinInterface {
	id: string;
	user: UserInterface;
	title: string;
	description: string;
	rating: number;
	lat: number;
	long: number;
	createdAt: Date;
	updatedAt: Date;
}
