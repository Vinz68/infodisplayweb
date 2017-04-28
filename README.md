## InfoDisplayWeb

InfoDisplayWeb is a simple solution for showing information (in a kind of kiosk-mode slide show) using a client side web browser and server side NodeJS program.
It can show any number of images (JPG) and/or web pages (which can be embeded in an iFrame).


### Dependencies
InfoDisplayWeb is based on:

* **NodeJS:**  ([https://nodejs.org/en/](https://nodejs.org/en/))
 
It is designed to run on:
 - a Raspberry PI-3, 
 - using the operating system: Raspbian Jessie with Pixel 

but might run on other hardware which is supported by NodeJS.

So an installation of NodeJS and NPM is required.

## Installation and Usage

### InfoDisplayWeb

Copy the nodeJsApps and html folder to the pi home directory.

```sh
/home/pi/nodeJsApps/infodisplay   (the NodeJS program)
/home/pi/html                     (the HTML content)
```
Note another directory can be used; but configuration files might need to changed accordingly:
```sh
/home/pi/nodeJsApps/infodisplay/modules/news/newsHandler.json
/home/pi/nodeJsApps/infodisplay/modules/slides/newSlidesHandlerConfig.json
```
then install all its dependencies (as registered in package.json) with:

```sh
cd ~/nodeJsApps/infodisplay
npm install
```


## Building/Testing

```sh
npm start
```


## Known problems

Error: listen EACCES 0.0.0.0:80

Resolve this errror by:

Allow node to Run on port 80 (without root permissions):
```sh
sudo setcap 'cap_net_bind_service=+ep' /usr/bin/nodejs
```





