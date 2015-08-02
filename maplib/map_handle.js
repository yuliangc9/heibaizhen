/**
 * Created by chenyuliang01 on 2015/7/25.
 */

//format : n-m => {...}, there are n nodes have m line
var g_struct_record = {};

/**
 * 判断一张图是否是重复的结构
 * @param nodes 图结构
 * @returns {boolean} 是否重复
 */
function map_repeat(nodes) {
    var is_repeat = true;

    //1. 记录有n个连接的点有多少个
    var connect_count = new Array(nodes.length + 1);
    for (var i = 0; i < nodes.length + 1; i++) {
        connect_count[i] = 0;
    }

    for (var i = 0; i < nodes.length; i++) {
        var one_node_count = 0;
        for (var j = 0; j < nodes.length; j++) {
            if (nodes[i][j] == 1) {
                one_node_count++;
            }
        }

        connect_count[one_node_count] += 1;
    }

    //2. 遍历整个点的连接情况，判断是否已经重复
    var cur_record = g_struct_record;
    for (var i = 1; i < connect_count.length; i++) {
        if (connect_count[i] == 0) {
            continue;
        }

        var key_format = i + "-" + connect_count[i];
        if (!cur_record[key_format]) {
            is_repeat = false;

            cur_record[key_format] = {};
        }

        cur_record = cur_record[key_format];
    }

    return is_repeat;
}

function choose_connection(nodes, cur_node, cb) {
    var max_connection = Math.floor(cur_node);

    if (cur_node == nodes.length) {
        if (!map_repeat(nodes)) {
            cb(nodes);
        } else {
            //console.log("get a repeat map");
        }
        return;
    }

    var points = new Array(max_connection);
    for (var i = 0; i < max_connection; i++) {
        points[i] = 0;
    }

    function connect_points(flag) {
        var last_connect = -1;

        for (var i = 0; i < max_connection; i++) {
            if (last_connect == points[i])
                continue;

            last_connect = points[i];
            flag ? connect_node(nodes, points[i], cur_node) : disconnect_node(nodes, points[i], cur_node);
        }
    }

    while (points[0] < cur_node) {
        connect_points(true);
        choose_connection(nodes, cur_node + 1, cb);
        connect_points(false);

        for (var flag = max_connection - 1; flag >= 0; flag--) {
            if (points[flag] + 1 < cur_node) {
                points[flag]++;
                for (var i = flag + 1; i < max_connection; i++) {
                    points[i] = points[flag];
                }
                break;
            }
            if (flag == 0) {
                points[flag]++;
            }
        }
    }
}

/**
 * 生成互不相同的图结构
 * @param num 图中的点, must bigger than 3
 * @param cb 每次生成一张图回调一次
 */
function gen_map(num, cb) {
    var nodes = init_map(num);

    connect_node(nodes, 0, 1);
    choose_connection(nodes, 2, cb);
}

/**
 * 初始化一个图结构
 * @param m 如果m为数字，则产生一个新图，如果为array，则初始化这个图
 * @returns 初始化后的图
 */
function init_map(m) {
    var nodes = null;
    var num = 0;

    if (typeof m === 'number') {
        num = m;
        nodes = new Array(num);

        for (var n = 0; n < num; n++) {
            nodes[n] = new Array(num);
        }
    }
    else {
        nodes = m;
        num = m.length;
    }

    for (var i = 0; i < num; i++) {
        for (var j = 0; j < num; j++) {
            nodes[i][j] = 0;
        }
    }

    return nodes;
}

function connect_node(map, node1, node2) {
    map[node1][node2] = 1;
    map[node2][node1] = 1;
}

function disconnect_node(map, node1, node2) {
    map[node1][node2] = 0;
    map[node2][node1] = 0;
}

//record the map has been reach
var g_reached_record = new Array();
var g_step_record = new Array();
var best_step = -1;
var best_train = null;

function resolve_map(nodes, result, step/*, click_train*/) {
    if (best_step != -1 && step >= best_step -1) {
        return ;
    }
    if (result == (1 << nodes.length) - 1) {
        //best_train = click_train;
        best_step = step;
        return 1;
    }
    if (g_reached_record[result] <= step) {
        return ;
    }
    if (g_step_record[result]) {
        if( g_step_record[result] + step < best_step) {
            best_step = g_step_record[result] + step;
        }
        return g_step_record[result] + 1;
    }
    g_reached_record[result] = step;


    var new_result;
    var tmp = 0;
    for (var i = 0; i < nodes.length; i++) {
        if (i == 6) continue;

        new_result = result;

        new_result ^= 1 << i;
        for (var j = 0; j < nodes.length; j++) {
            if (nodes[i][j]) {
                new_result ^= 1 << j;
            }
        }
        tmp = resolve_map(nodes, new_result, step + 1/*, click_train.concat(i)*/);
        if(tmp){
             g_step_record[result] = tmp;
        }
    }
    return g_step_record[result] ?  g_step_record[result] + 1 : 0;
}

var map_count = 0;
gen_map(6, function (valid_map) {
    console.log("get a map!! total: %d", ++map_count);
    console.dir(valid_map);

    console.log("caculate step...");
    resolve_map(valid_map, 0, 0);
    console.log("step need : %d", best_step);
    console.dir(best_train);
    g_reached_record = new Array();
    g_step_record = new Array();
    best_step = -1;
});

//var test_map = [ 
//  [ 0, 1, 1, 1, 1, 1, 0 ],
//  [ 1, 0, 0, 0, 0, 0, 1 ],
//  [ 1, 0, 0, 0, 0, 0, 0 ],
//  [ 1, 0, 0, 0, 0, 0, 0 ],
//  [ 1, 0, 0, 0, 0, 0, 0 ],
//  [ 1, 0, 0, 0, 0, 0, 0 ],
//  [ 0, 1, 0, 0, 0, 0, 0 ] ]
//
//resolve_map(test_map, 0, 0, new Array());
//console.log(best_step);
