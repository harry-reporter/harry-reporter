const harry = (hermione: any, opts: any): void => {
  hermione.on(hermione.events.INIT, () => {
    process.stdout.write('Harry init');
  });
};

module.exports = harry;
