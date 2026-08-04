<!--META_ENTRY_ID=mgba-->
<!--META_ENTRY_DATE=2026-08-04-->
<!--META_ENTRY_TITLE=Installing mGBA on Ubuntu-->
<!--META_ENTRY_TAGS=linux,ubuntu,tutorial-->

Recently, I've been pushing myself to learn Linux as a way of branching out and moving away from Windows as my main OS. One of those projects is a private romhack I work on in my spare time, for which I use mGBA for play testing.

Ubuntu is overall an extremely stable and secure OS, but one thing I've been extremely careful of is where my applications come from - as more and more people move to Linux, malicious packages will likely become much more common - similar to what we've already seen in the Arch AUR service. With that perspective in mind, please see my recommended methods for installing mGBA on Ubuntu.

## Install from App Center (Not Recommended)

mGBA is available on the Ubuntu App Center, however I highly recommend not installing from this source, as (at time of writing) both available packages are either extremely out of date or not maintained by users connected to the project. This may lead to crashes or potential security risks in the future.

## Install mGBA using flatpak (Recommended)

The easiest and safest way to install the latest version of mGBA is flatpak, which has an official mGBA package maintained by one of the main contributors to the mGBA project, endrift.

If you do not have flatpak installed, install it first using the following:

`sudo apt-get install flatpak`

And then add the flathub package repository:

`flatpak remote-add --if-not-exists flathub https://dl.flathub.org/repo/flathub.flatpakrepo`

And then, install mGBA by running the following:

`flatpak install flathub io.mgba.mGBA`

And when prompted, accept any changes.

## Install mGBA using apt-get

The next suggested option for installing mGBA on Ubuntu is to use the apt package manager to install the latest version - This will also allow it to be automatically updated when newer package versions are released.

The packages are maintained by the [Debian Games Team](https://wiki.debian.org/Teams/Games), who appear to be a reputable source who manage a lot of gaming-related packages on the Debian ecosystem.

There are three packages which are available, the core package (mgba-common) and two front-end versions: mgba-qt and mgba-sdl.

The SDL version has a cleaner interface, and can be launched using the terminal (e.g. `mgba my-rom-here.gba`) - However the QT version is easier to use (and comes with a start menu shortcut) but with a fairly dated interface.

To install all three at once, run the following:

`sudo apt-get install mgba-common mgba-qt mgba-sdl`

## Install mGBA using the official download page (24.x and below only)

There is not currently an official release for mGBA which supports Ubuntu 26.x - So for now, the following steps are limited to versions 24.10 and below. 

Navigate to [downloads](https://mgba.io/downloads.html) and click on the version for your Ubuntu version.

Once downloaded, navigate to the downloads directory, extract the archive and open the folder.

Open a terminal window in the folder and run the following:

`sudo apt install ./libmgba.deb ./mgba-qt.deb ./mgba-sdl.deb`

libmgba is the common library, and mgba-qt and mgba-sdl are two different front-end versions. The SDL version has a cleaner interface, and can be launched using the terminal (e.g. `mgba my-rom-here.gba) - However the QT version is easier to use (and comes with a start menu shortcut) but with a fairly dated interface.

If you have any issues with missing dependencies in this step, please try one of the other available methods.

## Run mGBA using the official AppImage

This method is less convenient than the other above methods, as it does not actually install the application - You will need to navigate to the app each time you want to launch it. However, if you are unable to get the above methods to work, this method works fine.

In order to run AppImages, ensure you have Fuse installed first:

`sudo apt install libfuse2t64`

Navigate to [downloads](https://mgba.io/downloads.html) and click on the 'AppImage' for your architecture (In most cases, 64-bit)

Navigate to your downloads folder and open a new terminal window, and run the following:

`chmod +x mGBA-0.10.5-appimage-x64.appimage`

Then, you should be able to double-click the app image and mGBA will open.

## Final Steps

If you installed the sdl or flatpak versions, you can launch mgba by running the following:

`mgba my-rom.gba`

Otherwise, if you installed the qt version, you should be able to launch it from the app shortcut.

Hopefully this little guide helped you install mGBA on Ubuntu in a safe and secure way.

Thanks for reading!
