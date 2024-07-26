import { ICharacter } from "./character.interface";
import { IPageInfo } from "./page-info.interface";

export interface IApiResponse {
   info: IPageInfo;
   results: Array<ICharacter>;
}