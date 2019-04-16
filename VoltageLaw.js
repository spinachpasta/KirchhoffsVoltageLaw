var KVL={
    analyze:function(lines,points){
        var voltages=[];
        var connected=new Array(points.length);
        var passed=[];
        for(var i=0;i<connected.length;i++){
            connected[i]=[];
            points[i].index=i;
            if(isNaN(points[i].voltage)){
                points[i].voltage=undefined;
            };
        }
        for(var i=0;i<lines.length;i++){
            connected[(searchPoint(lines[i].from.uuid))].push(lines[i]);
            connected[(searchPoint(lines[i].to.uuid))].push(lines[i]);
        }

        function searchline( l){
            for(var i=0;i<lines.length;i++){
                if(l==lines[i])return i;
            }
            return -1;
        }

        function searchPoint( uuid){
            for(var i=0;i<points.length;i++){
                if(points[i].uuid==uuid)return i;
            }
            return -1;
        }
        var reserved=[0];
        var reserved1=[];
        var voltage=new Array(points.length);
        voltage[0]=0;
        console.log(connected);
        for(;;){
            reserved1=[];
            for(var i=0;i<reserved.length;i++){
                var pidx=reserved[i];
                var p=points[pidx];
                if(passed.includes(pidx)){
                    continue;
                }else{
                    passed.push(pidx);
                }
                console.log(pidx);
                console.log(connected[pidx]);
                for(var j=0;j<connected[pidx].length;j++){
                    var l=connected[pidx][j];
                    if(l.from==p){
                        var p1=l.to;
                        var idxp1=searchPoint(p1.uuid);
                        console.log(idxp1);
                        console.log(pidx);
                        var v1=Number(voltage[pidx])+Number(l.voltage);
                        if(passed.includes(idxp1)){
                            if(l.voltage!=undefined&&
                               voltage[idxp1]!=undefined&&
                               Math.abs(voltage[idxp1]-v1)>0.01){
                                console.log(voltage);
                                alert("an invalid loop was found!!");
                                return;
                            }
                        }else if(l.voltage!=undefined){
                            reserved1.push(idxp1);
                            voltage[idxp1]=v1;
                        }
                    }else{
                        var p1=l.from;
                        var idxp1=searchPoint(p1.uuid);
                        console.log(p);
                        console.log(p1);
                        console.log(idxp1);
                        console.log(pidx);
                        var v1=Number(voltage[pidx])-Number(l.voltage);
                        if(passed.includes(idxp1)){
                            if(l.voltage!=undefined&&
                               voltage[idxp1]!=undefined&&
                               Math.abs(voltage[idxp1]-v1)>0.01){
                                console.log(voltage);
                                alert("an invalid loop was found!!"+(voltage[idxp1])+","+(voltage[pidx]));
                                return;
                            }
                        }else if(l.voltage!=undefined){
                            reserved1.push(idxp1);
                            voltage[idxp1]=v1;
                        }
                    }
                }
            }
            if(reserved1.length==0)break;
            console.log(reserved);
            reserved=reserved1.slice();
        }
        console.log(voltage);
        
        for(var i=0;i<lines.length;i++){
            var ll=lines[i];
            if(ll.voltage==undefined){
                var p1=ll.to;
                var p2=ll.from;
                if(voltage[p1.index]!=undefined&&
                  voltage[p2.index]!=undefined){
                    ll.voltage=voltage[p1.index]-voltage[p2.index];
                }
            }
        }
    },
    Point:function(){
        this.type="point";
        this.uuid=Math.random();
        this.x=0;
        this.y=0;
        this.z=0;
        this.index=0;
        this.FromObj=function(obj){
            this.connected=obj.connected;
            this.x=obj.x;
            this.y=obj.y;
            this.z=obj.z;
        };
    },
    Line:function(from,to,V){
        this.type="line";
        this.from=from;
        this.to=to;
        this.voltage=V;
    }
};