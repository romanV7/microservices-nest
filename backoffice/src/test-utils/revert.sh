condition=true
str='reverted successfully.'
while $condition; do
    res=$(eval 'npm run seed:revert | grep "$str"')    

    if [[ "$res" == *"$str"* ]]; 
    then
        echo $res
    else
        condition=false
        echo 'Nothing to revert!'
    fi
done
