d3ComponentLibrary
===

## About

The d3 component gallery is a Sparkl plugin that bundles specific visualizations
as ctools components to be used in dashboards.

Please help us extending this gallery


## Installing

In order to install the D3 Component Library, either get it from the [Pentaho
Marketplace](http://community.pentaho.com/marketplace/plugins/) or clone this
project directly into your _pentaho-solutions/system_ and do an _ant resolve_.

Pentaho 5.x required.


## Adding new visualizations.


If your favorite visualization is not part of the gallery, follow this
instructions to add it:


### Pick your visualization

Choose one from [the d3 gallery](https://github.com/mbostock/d3/wiki/Gallery),
from somewhere else, or create your own.


### Install Sparkl

Make sure you have [Sparkl](http://community.pentaho.com/projects/sparkl/)
installed. Everyone should have it :)


### Create a dashboard for your new visualization

In the directory _d3ComponentLibrary/dashboards_ you'll see the available
dashboards. Pick the one you want. Currently you may need to manually copy the
source files (_.wcdf_ and _.cdfde_). In what I hope to be a recent future we'll
be able to simply do a _save as_ from within CDE, but that's currently not
allowed. Refresh the sparkl application through the UI or through the url:

  http://127.0.0.1:8080/pentaho/plugin/d3ComponentLibrary/api/refresh

The name of the dashboard will be the id of the visualization you're creating.
This is where you'll supply an example and the documentation for the
visualization.


### Create the directory for the CDE component

The code for the visualizations are in
_d3ComponentLibrary/resources/components_. Create a directory there with the
name of your visualization. 


### Create component.xml

Every component needs to have a `component.xml` that acts as a descriptor for
CDE to know how to use it. My suggestion is for you to look into one of the
existing ones and use it as a template.

The important bits in there are:

* Header - put the component information there
* Contents/Model - The specific options of the component. Most of them are plain
  CDF, so leave them there, and add the ones you want
* Implementation - Point to your code. You'll need a Styles tag if you want to
  also supply a CSS code
* Dependencies - The dependencies for the component code. d3 is already in the
  plugin, and some helper functions are provided in _d3ComponentBase.js_, so
  most likely you won't need anything here


### Implement your code

This is a standard CDF component, that extends _D3ComponentBase_. Note that the
name of the component always starts with an uppercase letter, and the variable
name is the same as specified in the _Header/IName_ node in _component.xml_
appended with _"Component"_.

You'll mostly need to implement the _render_ function, and use the original d3
code as an example. Then you'll need to hook in the data that comes from Pentaho
and parametrize any arguments you wish. Take a look at the bundled
visualizations.

The arguments added to the visualization should be added to the _component.xml_
file, in _//Contents/Model/_. 


### Test it

When you make changes to the _component.xml_ file, you need to refresh CDE. Use
the following url:

  http://127.0.0.1:8080/pentaho/plugin/pentaho-cdf-dd/api/renderer/refresh


If everything worked correctly, you Then you should be able to see the new
component in CDE, under the _D3 Components_ group and use it in a dashboard.

To test your code, simply execute the dashboard, eg with:

  127.0.0.1:8080/pentaho/plugin/d3ComponentLibrary/api/calendarview?debug=true&bypassCache=true

. Adding _debug=true&bypassCache=true_ is only useful for bypassing the
minification step, allowing to use a javascript browser debugger like firebug or
developer tools.


### Add an image

Add an image to _static/custom/img_ with your visualization - it will be picked
and shown in the index.


### Submit it back

Send it to us! Do a pull request or through [email](pedro.alves@pentaho.com)


# Questions?

Find us at ##pentaho irc channel in irc.freenode.net, through the [Pentaho
Community mailing
list](https://groups.google.com/forum/#!forum/pentaho-community) or through the
[Pentaho Forums](http://forums.pentaho.com/)



