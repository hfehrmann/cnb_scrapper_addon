
ENCRYPTION_MESSAGE="Look for \"op item get ScrapperAddon --fields label='Resources password'\" in 1Password"

CHECKSUM_FOLDER_CONTAINER="tests/resources"
CHECKSUM_FOLDER="htmls"
CHECKSUM_FUNCTION="find -s $CHECKSUM_FOLDER_CONTAINER/$CHECKSUM_FOLDER -type f -exec shasum -a 256 {} \\; | grep -v .DS_Store | shasum -a 256"
CHECKSUM_FILE="$CHECKSUM_FOLDER_CONTAINER/${CHECKSUM_FOLDER}.checksum"

function encrypt() {
    echo "> Encrypt"
    echo ">> $ENCRYPTION_MESSAGE"
    docker run \
        --rm -it \
        --workdir /data \
        -v $(pwd)/$CHECKSUM_FOLDER_CONTAINER:/data \
        crazymax/7zip \
        7za a -aoa -mhe -p $CHECKSUM_FOLDER.7z $CHECKSUM_FOLDER
}

function decrypt() {
    echo "> Decrypt"
    echo ">> $ENCRYPTION_MESSAGE"
    rm -rf $CHECKSUM_FOLDER_CONTAINER/$CHECKSUM_FOLDER
    docker run \
        --rm -it \
        --workdir /data \
        -v $(pwd)/$CHECKSUM_FOLDER_CONTAINER:/data \
        crazymax/7zip \
        7za x -aoa $CHECKSUM_FOLDER.7z
}

function check() {
    echo "> Check"
    echo ">> $CHECKSUM_FUNCTION"
    echo ">> $CHECKSUM_FILE"
    dir_checksum=$(eval $CHECKSUM_FUNCTION);
    current_checksum=$(cat $CHECKSUM_FILE);

    if [[ "$dir_checksum" = "$current_checksum" ]]; then
        exit 0;
    else
        echo "\033[1;31mERROR:\033[0m HTML resources changed"
        exit 1;
    fi
}

function test() {
    echo "> Test"
    echo ">> $CHECKSUM_FUNCTION"

    eval "$CHECKSUM_FUNCTION"
}

function save() {
    echo "Save"
    echo ">> $CHECKSUM_FUNCTION > $CHECKSUM_FILE"

    eval "$CHECKSUM_FUNCTION > $CHECKSUM_FILE"
}

if [[ "$1" = "check" ]]; then
    check;
elif [[ "$1" = "test" ]]; then
    test;
elif [[ "$1" = "save" ]]; then
    save;
elif [[ "$1" = "encrypt" ]]; then
    encrypt;
elif [[ "$1" = "decrypt" ]]; then
    decrypt;
else
    echo "Choose one of the folling <commands>: check, test, save, encrypt, decrypt."
fi
