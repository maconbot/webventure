/********************** public functions *********************/
var WinBorder=1;
var WinTitleHeight=18;
var WinInfoHeight=18;
var WinAlertBorder=2;
var VScrollWidth=15;
var HScrollHeight=15;

var HScrollArrowRight=15;
var HScrollBucket=15;
var HScrollBucketStart=15;

var VScrollArrowDown=15;
var VScrollBucket=15;
var VScrollBucketStart=15;

var GrowWidth=15;
var GrowHeight=15;

var winbg=0;


function getAboutWin()
{
	var r=getRes(resGetIndStr(0x81,1),0);
	var len=r.r8();
	var name=toascii(r.read(len));
	var dialog=createAlert(146,96,220,150);
	dialog.add(createCtl([75,120,70,18],1,0xa,['Ok']));
	dialog.add(createCtl([20,30,180,40],2,0xf,name));
	dialog.add(createCtl([20,80,180,40],3,0xf,['WebVenture <br/> &#169; 2010 Sean Kasun']));
	dialog.getItem(2).css('text-align','center');
	dialog.getItem(3).css('text-align','center');
	return dialog;
}

function getVolumeWin()
{
	var dialog=createAlert(146,96,220,120);
	dialog.add(createCtl([75,90,70,18],1,0xa,['Ok']));
	dialog.add(createCtl([55,55,110,13],2,0x18,[0,0,100]));
	dialog.add(createCtl([20,25,180,20],3,0xf,['Sound Volume']));
	dialog.getItem(3).css('text-align','center');
	return dialog;
}

function getAskSave(why)
{
	var whys=[8,9,7];
	var name=toascii(resGetIndStr(0x80,whys[why]));
	var win=getAlert(getRes('ALRT',0x83));
	win.param([name]);
	return win;
}

function getOpenDialog()
{
	var dialog=createAlert(82,71,348,200);
	dialog.add(createCtl([256,138,80,18],1,0xa,['Open']));
	dialog.add(createCtl([256,163,80,18],2,0xa,['Cancel']));
	dialog.add(createCtl([12,39,218,146],3,0x17,[]));
	return dialog;
}

function getSaveDialog()
{
	var dialog=createAlert(104,79,304,184);
	dialog.add(createCtl([218,132,70,18],1,0xa,['Save']));
	dialog.add(createCtl([218,158,70,18],2,0xa,['Cancel']));
	dialog.add(createCtl([14,136,183,16],5,0xf,['Save as:']));
	dialog.add(createCtl([17,157,177,16],3,0x11,['']));
	dialog.add(createCtl([14,29,183,98],4,0x17,[]));
	return dialog;
}

function getWindow(res)
{
	var top=res.r16();
	var left=res.r16();
	var height=res.r16()-top;
	var width=res.r16()-left;
	var def=res.r16();
	var type='';
	var zoom=false;
	switch (def)
	{
		case 0: type='document'; break;
		case 1: type='dBox'; break;
		case 2: type='plainDBox'; break;
		case 3: type='altDBox'; break;
		case 4: type='noGrowDoc'; break;
		case 5: type='movableDBox'; break;
		case 8: type='zoomDoc'; zoom=true; break;
		case 12: type='zoomNoGrow'; zoom=true; break;
		case 16: type='rDoc16'; break;
		case 18: type='rDoc4'; break;
		case 20: type='rDoc6'; break;
		case 22: type='rDoc10'; break;
	}
	var vis=res.r16()!=0;
	var close=res.r16()!=0;
	var refCon=res.r32();
	var titleLen=res.r8();
	var title='';
	if (titleLen!=1)
		title=toascii(res.read(titleLen));
	return createWindow(type,close,zoom,false,false,left,top,width,height);
}

function getAlert(res)
{
	var top=res.r16();
	var left=res.r16();
	var height=res.r16()-top;
	var width=res.r16()-left;
	var itemlist=res.r16();

	var dialog=createAlert(left,top,width,height);

	var items=getRes('DITL',itemlist);
	var numitems=items.r16()+1;
	for (var i=0;i<numitems;i++)
	{
		items.r32(); //reserved
		top=items.r16();
		left=items.r16();
		height=items.r16()-top;
		width=items.r16()-left;
		var type=items.r8();
		var titleLen=items.r8();
		var title='';
		if (titleLen>0)
			title=toascii(items.read(titleLen));
		if (titleLen&1) items.r8(); //align
		var ctl;
		switch (type&0x7f)
		{
			case 4: //button
				dialog.add(createCtl([left,top,width,height],0xa,i+1,[title]));
				break;
			case 8: //static text
				dialog.add(createCtl([left,top,width,height],0xf,i+1,[title]));
				break;
			case 0x10: //edit text
				dialog.add(createCtl([left,top,width,height],0x11,i+1,[title]));
				break;
			default:
				fatal("Unknown DITL:"+(type&0x7f));
		}
	}
	return dialog;
}

/********************** private functions *********************/