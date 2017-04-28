## InfoDisplayWeb

InfoDisplayWeb is a simple solution for showing information (in a kind of kiosk-mode slide show) using a client side web browser and server side NodeJS program.
It can show any number of images (JPG) and/or web pages (which can be embeded in an iFrame).


## Installation

* fork the repository to your github account.
* on you machine make a folder (I used /home/vincent/nodeJsApps)
* clone the repository into this folder and install the needed node modules

```sh
git clone https://github.com/Vinz68/logTest.git

cd infodisplayweb 

npm install
```

Note another directory can be used; but configuration files might need to changed accordingly, the config files are:
```sh
./modules/news/newsHandler.json
./modules/slides/newSlidesHandlerConfig.json
```

### Prerequsites / Dependencies
InfoDisplayWeb is based on:

* **NodeJS:**  ([https://nodejs.org/en/](https://nodejs.org/en/))
* **NodeJS and NPM are required**
 
It is developed on Ubuntu (both physical machine as an Azure VM) but might run on other hardware which is supported by NodeJS.
There is also a version for a raspberry pi see: "InfoDisplay" package in my github.


## Start, Use, Test 

```sh
npm start
```

## Known problems

### Error: listen EACCES
When using port 80 you might get a root permission issue; and will get this message:

**Error: listen EACCES 0.0.0.0:80**

Resolve this errror by opening infodisplayweb.js and change the PORT to another port (e.g. 8080),

**OR** set the PORT environmet variable to another port (e.g. 8080)

**OR** Allow node to Run on port 80 (without root permissions):

```sh
sudo setcap 'cap_net_bind_service=+ep' /usr/bin/nodejs
```

### other issues ?
Submit an issue to get it solved.






