<?php 

$content = array();
	
$row = 0;
if (($handle = fopen("cols.csv", "r")) !== FALSE) {
    while (($row_data = fgetcsv($handle, 0, ",")) !== FALSE) {
        $num = count($row_data);
        // echo "<p> $num полей в строке $row: <br /></p>\n";
        for ($c=0; $c < $num; $c++) {
            $content['cols'][] = $row_data[$c];
        }
        $row++;
    }
    fclose($handle);
}

$row = 0;
if (($handle = fopen("items.csv", "r")) !== FALSE) {
    while (($row_data = fgetcsv($handle, 0, ",")) !== FALSE) {
        $num = count($row_data);
        // echo "<p> $num полей в строке $row: <br /></p>\n";
        for ($c=0; $c < $num; $c++) {
        	$text = $row_data[$c];
        	if ($text !== '' && trim($text) !== '-') {
        		$methods = array();
        		$tmp_methods = explode(',', $text);
        		foreach ($tmp_methods as $key => $value) {
        			$method = (int) trim($value);
        			$methods[] = $method;
        		}
        		$text = $methods;
        	}
            $content['rows'][$row][] = $text;
        }
        $row++;
    }
    fclose($handle);
}
$row = 1;
if (($handle = fopen("methods.csv", "r")) !== FALSE) {
    while (($row_data = fgetcsv($handle, 0, ",", '"','"')) !== FALSE) {
        $num = count($row_data);
        for ($c=0; $c < $num; $c++) {
            $content['methods'][$row][] = str_replace('|', PHP_EOL, $row_data[$c]);
        }
        $row++;
    }
    fclose($handle);
}

?>
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<title>40</title>
	
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

	<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
	<script src="https://code.jquery.com/jquery-3.4.1.slim.min.js" integrity="sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n" crossorigin="anonymous"></script>
	<script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous"></script>
	<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js" integrity="sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6" crossorigin="anonymous"></script>
<style>
body{
	overflow-y: scroll;
}
#content{
    padding: 2vh;
}
ul.checkbox_list{
	list-style-type: none;
	margin: 0px;
	padding: 10px;
}

ul.checkbox_list > li+li{
	border-top: 1px dashed #aaa;
}
ul.checkbox_list > li > label{
	display: block;
	margin:0px;
	padding:4px;
	cursor: pointer;
}
ul.checkbox_list > li > label:hover{
	background: #eee;
}
ul.checkbox_list > li > label.checked{
	background: #ccc;
}
ul.checkbox_list > li > label.disabled{
	opacity: .4;
}
.listbox{
	height: 38vh;
    overflow-y: scroll;
    box-shadow: inset 0px 0px 9px -4px #000;
    border: 1px solid #aaa;
    border-right: none;
    margin: 20px 0px;
}
.listbox input[type=checkbox]{
	position: relative;
    top: 5px;
}
#results{
	min-height: 40vh;
}
.result .badge{
	cursor: pointer;
}
</style>
</head>
<body>
<div class="container" id="content">
<script>
content = <?php echo json_encode($content) ?>;
selected = [];
function nl2br(str){
	return str.replace(/([^>])\n/g, '$1<br/>');
}

$(document).ready(function() {
	$('#list-1 input[type=checkbox]').on('click', function(event) {
		if ($(this).parent('label').hasClass('disabled')) return false;
		$(this).parent('label').toggleClass('checked');
		check();
	});
	$('#list-2 input[type=checkbox]').on('click', function(event) {
		if ($(this).parent('label').hasClass('disabled')) return false;
		$(this).parent('label').toggleClass('checked');
		check_inverse();
	});
	$('h4>span.badge').on('click', function(event) {
		$(this).parents('.row').find('input[type=checkbox]:checked').prop('checked', false).parent('label').removeClass('checked').removeClass('disabled');
		check();
	});
	$('#results .result, #description .result').on('click', '.badge', function(event) {
		event.preventDefault();
		var method_id = $(this).data('id');
		$('#method-modal .modal-title').html(method_id+' '+content['methods'][method_id][0]);
		$('#method-modal .modal-body').html(nl2br(content['methods'][method_id][1]));
		$('#method-modal').modal();
	});
	$('.result').on('mouseover', '.badge.badge-success', function(event) {
		console.log('over');
		$('.badge[data-id=' + $(this).data('id') + '].badge-secondary').addClass('badge-success');
	}).on('mouseleave', '.badge.badge-success', function(event) {
		console.log('leave');
		$('.badge[data-id=' + $(this).data('id') + '].badge-secondary').removeClass('badge-success');		
	});
		
	function check(){
		$('#list-2 input[type=checkbox]:checked').removeClass('disabled');
		$('#list-2 label').removeClass('disabled');
		$.each($('#list-1 input[type=checkbox]:checked').not('.disabled'), function(index, val) {
			
			value = $(val).val();

			$.each(content['rows'][value], function(index2, val2) {
				if (val2 == '' || val2 == '-') {
					$('#list-2 input[type=checkbox][value=' + index2 + ']').parent('label').addClass('disabled');
				}
			});
		});
		check_inverse();
	}
	function check_inverse(){
		$('#list-1 input[type=checkbox]:checked').removeClass('disabled');
		$('#list-1 label').removeClass('disabled');
		$.each($('#list-2 input[type=checkbox]:checked').not('.disabled'), function(index, val) {
			
			value = $(val).val();

			$.each(content['rows'][value], function(index2, val2) {
				if (val2 == '' || val2 == '-') {
					$('#list-1 input[type=checkbox][value=' + index2 + ']').parent('label').addClass('disabled');
				}
			});
		});
		select_method();
	}
	function select_method(){
		selected = [];
		$('#results .result, #description .result').html('');
		$.each($('#list-1 input[type=checkbox]:checked').not('.disabled'), function(index, val) {
			value = $(val).val();
			$.each($('#list-2 input[type=checkbox]:checked').not('.disabled'), function(index2, val2) {
				value2 = $(val2).val();
				title1 = $(val).data('title');
				title2 = $(val2).data('title');

				method = content['rows'][value][value2];
				if (method !== '' && method !== '-') {
					selected.push(method);
					var text = title1 + ', ' + title2 + '<br />';
					$.each(method, function(index, val) {
						text += '<span class="badge badge-secondary" data-id="' + val + '">' + val + '</span> ';
					});
					text += '<br />';
					$('#results .result').append(text);
				}
			});
		});

		var top = [];
		var st = [].concat(...selected);
		st = st.reduce(function(acc, el) {
		  acc[el] = (acc[el] || 0) + 1;
		  return acc;
		}, {});

		var top_rated = '';
		$.each(st, function(index, val) {
			if (val > 1) {
				top[index] = val;
				top_rated += 'Метод <span class="badge badge-success" data-id="' + index + '">' + index + '</span> повторяется ' + val + ' раз(а)<br />';
			}
		});
		if (top.length > 0) {
			$('#description .result').append(top_rated);
		}
	}

});
</script>
	
	<div class="row">
		<div class="col-sm-12 col-md-6 pnl_top_left">
	<h4>Что нужно изменить <span class="badge badge-secondary">Очистить выбор</span></h4>
	<div class="listbox">
		<ul class="checkbox_list" id="list-1">
		<?php foreach ($content['cols'] as $key => $value): ?>
			<li>
				<label>
					<?php echo $value ?>
					<input type="checkbox" value="<?php echo $key ?>" data-title="<?php echo $value ?>" name="contr" class="float-right">
				</label>
			</li>
		<?php endforeach ?>
		</ul>
	</div>
		
	</div>
	<div class="col-sm-12 col-md-6 pnl_top_right">
	<h4>Что ухудшается <span class="badge badge-secondary">Очистить выбор</span></h4>
		<div class="listbox">
		<ul class="checkbox_list" id="list-2">
		<?php foreach ($content['cols'] as $key => $value): ?>
			<li>
				<label>
					<?php echo $value ?>
					<input type="checkbox" value="<?php echo $key ?>" data-title="<?php echo $value ?>" name="contr" class="float-right">
				</label>
			</li>
		<?php endforeach ?>
		</ul>
	</div>
	<!-- <button type="button" class="btn btn-primary btn-lg">ВВыв фыв ф </button> -->
	</div>
	
	</div>
	<div class="row">
	
	<div class="col-sm-12 col-md-6" id="results">
		<h4>Результаты</h4>
		<div class="result">
			
		</div>
	</div>
	<div class="col-sm-12 col-md-6" id="description">
		<h4>Чаще упоминаются</h4>
		<div class="result">
			
		</div>
	</div>

	</div>	
		<!-- 
	<div class="row">
	<div class="col-sm-12">
		<h4>Таблица</h4>
		<table border="1" class="">
			<thead>
				<th>
					<?php foreach ($content['cols'] as $key => $value): ?>
					<td><?php echo $value ?></td>
					<?php endforeach ?>
				</th>
			</thead>
			<tbody>
				<?php foreach ($content['rows'] as $key => $value): ?>
				<tr>
					<td><?php echo $content['cols'][$key-1] ?></td>
					<?php foreach ($value as $key2 => $value2): ?>
					<td><?php echo is_array($value2) ? implode(', ', $value2) : $value2; ?></td>
					<?php endforeach ?>
				</tr>
				<?php endforeach ?>
			</tbody>
		</table>
	</div>
	</div>
 -->
</div>

<div class="modal" id="method-modal" tabindex="-1" role="dialog">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Modal title</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <p>Modal body text goes here.</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>

</body>
</html>