import SystemMenu from "./SystemMenu";
import FileMenu from "./FileMenu";
import ChartsMenu from "./ChartsMenu";
import ControllersMenu from "./ControllersMenu";
import DataMenu from "./DataMenu";

export default class WeaveMenus {

	systemMenu:SystemMenu;
	fileMenu:FileMenu;
	chartsMenu:ChartsMenu;
	dataMenu:DataMenu;
	controllersMenu:ControllersMenu;

	constructor(weave:Weave, createObject:(type:new(..._:any[])=>any)=>void)
	{
		this.fileMenu = new FileMenu(weave);
		this.systemMenu = new SystemMenu(weave, this.fileMenu);
		this.chartsMenu = new ChartsMenu(weave, createObject);
		this.dataMenu = new DataMenu(weave, createObject);
		this.controllersMenu = new ControllersMenu(weave, createObject);
	}
}