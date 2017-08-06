declare variable $URI as xs:string external;
declare variable $URIS_BATCH_REF as xs:string external;
declare variable $foo as xs:string external;
declare function local:is-divisible($a , $b){
    let $div-by:=$a div $b
    return $div-by eq fn:round($div-by)
};
let $response:="This is a file generated by the XQUERY-MODULE (Transform) which typically contains a report.  This information [" || $URI || "] was passed from the Selector."
let $tokens:=fn:tokenize($URI,";")
let $_:=xdmp:sleep(1000)
return if(fn:count($tokens) eq 1) then
let $tokens:=fn:tokenize($tokens[1],"/")
    let $last-tokens:=fn:tokenize($tokens[fn:last()],"[.]")
    let $file-name:=$last-tokens[1]
    return if($file-name castable as xs:int) then 
            if(local:is-divisible(xs:int($file-name) ,2)) then
                fn:error(xs:QName("error"),"Half of the inputs will be errors!")   
            else $response 
           else $response 
else
  $response