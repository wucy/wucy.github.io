var demo_data = '{"success":true,"boxes":[{"x1": 2, "x2": 5}, {"x1": 2, "x2" : 3}, {"x1": 2, "x2" : 3}, {"x1": 2, "x2": 5}, {"x1": 6, "x2": 8}, {"x1": 2, "x2": 5}, {"x1": 6, "x2": 8}, {"x1": 2, "x2": 4}, {"x1": 4, "x2": 7}, {"x1": 1, "x2": 3}, {"x1": 4, "x2": 5}, {"x1": 4, "x2": 8}, {"x1": 6, "x2": 8}, {"x1": 2, "x2": 5}, {"x1": 3, "x2": 9}]}'

var ctx = null;
var cur_box_comps = [];
var cur_box_y = null;
var cur_color = null;
var box_array = [];
var height_split = {};

var MAX_RANGE = 10000;
var min_x = 0;
var max_x = 10;
var max_y = 0;

var x_length = 0;
var y_length = 0;


var xPadding = 50;
var yPadding = 50;

var fps = 50;
var speed = 1;


function get_random_color() {
  return '#' + (function co(lor){   return (lor +=
  [0,1,2,3,4,5,6,7,8,9,'a','b','c','d','e','f'][Math.floor(Math.random()*16)])
  && (lor.length == 6) ?  lor : co(lor); })('');
}

function draw_point(x, y){
  ctx.beginPath();
  ctx.arc(x, y, 3, 0, 2 * Math.PI, true);
  ctx.fill();
}

function draw_axis(min_x, max_x, min_y, max_y)
{
    //console.log(max_y);
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#333';
    ctx.font = '17pt sans-serif';
    ctx.textAlign = "center";

    ctx.beginPath();
    ctx.moveTo(0.5 * xPadding, 0.5 * yPadding);
    ctx.lineTo(0.5 * xPadding, ctx.canvas.height - 0.5 * yPadding);
    ctx.lineTo(ctx.canvas.width - 0.5 * xPadding, ctx.canvas.height - 0.5 * yPadding);
    ctx.stroke();
    //console.log(x_length);
    for (var i = min_x; i <= max_x; ++ i)
    {
        draw_point(i / (max_x - min_x) * x_length + 0.5 * xPadding, ctx.canvas.height - 0.5 * yPadding);
        //console.log(max_x, min_x);
        //console.log(i, i / (max_x - min_x) * x_length + 0.5 * xPadding, ctx.canvas.height - 0.5 * yPadding);
        ctx.fillText(i, i / (max_x - min_x) * x_length + 0.5 * xPadding, ctx.canvas.height - 0.05 * yPadding);
    }
    for (var i = min_y + 1; i <= Math.ceil(max_y); ++ i)
    {
        draw_point(0.5 * xPadding, ctx.canvas.height - 0.5 * yPadding - i / (max_y - min_y) * y_length);
        ctx.fillText(i, 0.3 * xPadding, ctx.canvas.height - 0.4 * yPadding - i / (max_y - min_y) * y_length);
    }
    ctx.closePath();
}

function init_bqgram(json_data)
{
    //init data
    json_array = JSON.parse(json_data);
    if (!json_array['success'])
    {
        return;
    }
    box_array = json_array['boxes'];
    var check_y_height = {};
    for (var i = 0; i < box_array.length; ++ i)
    {
        x_range = box_array[i]['x2'] - box_array[i]['x1'];
        y_height = 1.0 / x_range;
        for (var j = box_array[i]['x1']; j <= box_array[i]['x2']; ++ j)
        {
            if (!(j in check_y_height))
            {
                check_y_height[j] = 0;
            }
            check_y_height[j] += y_height;
            if (check_y_height[j] > max_y)
            {
                max_y = check_y_height[j];
            }
            
            height_split[j] = 0;
        }

    }
    //init axis
    draw_axis(min_x, max_x, 0, max_y * 1.1);
    //console.log(max_y);
    //draw boxes
    //draw_bqgram_frame();
}

var cur_global_y = max_y;

var fps = 50;

function draw_box(x)
{
    var finish = false;
    var my_cur_y = cur_global_y;
    if (cur_global_y > ctx.canvas.height - 0.5 * yPadding - height_split[x])
    {
        my_cur_y = ctx.canvas.height - 0.5 * yPadding - height_split[x];
        finish = true;
    }
    /*console.log("clear",
            Math.floor(x / (max_x - min_x) * x_length + 0.5 * xPadding), 
            Math.floor(my_cur_y - cur_box_y - y_length / 50) - 10, 
            Math.floor(1 / (max_x - min_x) * x_length), 
        Math.floor(cur_box_y) + 10);
        */
    ctx.clearRect(
            Math.floor(x / (max_x - min_x) * x_length + 0.5 * xPadding), 
            Math.floor(my_cur_y - cur_box_y - y_length / 40 * speed) - ctx.canvas.height, 
            Math.ceil(1 / (max_x - min_x) * x_length), 
        Math.ceil(cur_box_y) + ctx.canvas.height);
    ctx.beginPath();
    ctx.fillStyle = cur_color;
    /*console.log("fill",
            Math.floor(x / (max_x - min_x) * x_length + 0.5 * xPadding), 
            Math.floor(my_cur_y - cur_box_y),
            Math.floor(1 / (max_x - min_x) * x_length), 
        Math.floor(cur_box_y));
        */
    ctx.fillRect(
            Math.floor(x / (max_x - min_x) * x_length + 0.5 * xPadding), 
            Math.floor(my_cur_y - cur_box_y),
            Math.ceil(1 / (max_x - min_x) * x_length), 
        Math.ceil(cur_box_y));
        
    /*ctx.beginPath();
    ctx.moveTo(Math.floor(x / (max_x - min_x) * x_length + 0.5 * xPadding), 
            Math.floor(my_cur_y - cur_box_y));
    ctx.lineTo(0, Math.floor(my_cur_y - cur_box_y));
    */
    ctx.stroke();
    
    ctx.closePath();
    return finish;
}


function draw_bqgram_frame()
{
setTimeout(function() {
    requestAnimationFrame(draw_bqgram_frame);
    if (cur_box_comps.length == 0 && box_array.length == 0)
    {
        return;
    }
    if (cur_box_comps.length == 0)
    {
        for (var i = box_array[0]['x1']; i <= box_array[0]['x2']; ++ i)
        {
            cur_box_comps.push(i);
        }
        //console.log(box_array[0]['x1'] + ' ' + box_array[0]['x2']);
        cur_box_y = 1 / (box_array[0]['x2'] - box_array[0]['x1']) * y_length / (max_y * 1.1);
        cur_color = get_random_color();
        cur_global_y = 0;
        //console.log(cur_box_y, box_array[0]['x1'], box_array[0]['x2']);
        box_array.shift();
        
    }
    var finish = true;
    cur_global_y += y_length / 40 * speed;
    
    for (var i = 0; i < cur_box_comps.length - 1; ++ i)
    {
        this_finished = draw_box(cur_box_comps[i]);
        
        if (!this_finished)
        {
            finish = false;
        }
    }
    if (finish)
    {
        for (var i = 0; i < cur_box_comps.length - 1; ++ i)
        {
            height_split[cur_box_comps[i]] += cur_box_y;
        }
        cur_box_comps = [];
    }
}, 1000 / fps);
}


window.onload = function() {    
    ctx = document.getElementById("bqgram").getContext("2d");
    ctx.canvas.width  = window.innerWidth * 0.8;
    ctx.canvas.height = window.innerHeight * 0.7;
    x_length = ctx.canvas.width - 2 * xPadding;
    y_length = ctx.canvas.height - 2 * yPadding;
    init_bqgram(demo_data);
};
