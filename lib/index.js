var harry = function (hermione, opts) {
    hermione.on(hermione.events.INIT, function () {
        process.stdout.write('Harry init');
    });
};
module.exports = harry;
