# INSTALL

Install nvm
    $ git clone git://github.com/creationix/nvm.git ~/.nvm
    $ source ~/.nvm/nvm.sh
Install node
    $ nvm install 0.8.14
    $ nvm alias default 0.8.14
Install global node modules
    $ npm install -g jake jshint mocha jsontool
Install local node modules
    $ cd PROJECT_DIRECTORY
    $ npm install

# USE

Run all tests
    $ jake
Clean working copy
    $ jake clean

# RECIPE

* package.json = npm project specification with metadata and dependencies
* Jakefile = jake build specification
* index.js = project entry point
* lib/ = local modules not installed by npm
* test/ = test sources
* node\_modules/ = local modules installed by npm
* .jshintrc = jshint project configuration
* .vimrc = vim project configuration (need to have vim-addon-local-vimrc plugin installed)
* .work/ = work directory created by 'jake prepare' for temporary/disposable files
