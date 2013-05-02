var client = require('./client').client,
    expect = require('chai').expect;

describe('test exquis initial state', function(){
    before(function(done) {
        client.init().url('http://127.0.0.1:8000/index.html', done);
    });
 
    describe('Check homepage', function(){
        it('should see the correct title', function(done) {
            client.getTitle(function(title){
                expect(title).to.have.string('Exquis');
                done();
            });
        });

        it('should not show the editor', function(done){
            client.isVisible('#editor', function(visible){
                expect(visible).to.be.false;
                done();
            });
        });

        it('should have nine canvas elements', function(done){

            client.pause(500)
                  .elements('tag name', 'canvas', function(canvases){
                    expect(canvases.value.length).to.equal(9);
                    done();
            });
    
        });
    });
 
    after(function(done) {
        client.end();
        done();
   });
 });


describe('Test editor', function(){
    before(function(done) {
        client.init().url('http://127.0.0.1:8000/index.html', done);
    });
 
    describe('on canvas click', function(){
        /*
        it('should see the correct title 2' , function(done) {
            client.getTitle(function(title){
                expect(title).to.have.string('Exquis');
                done();
            });
        });
         */

        it('should make the editor visible', function(done) {

            client.pause(500)
                  .click("#hint-2-1")
                  .isVisible('#editor', function(visible){
                        expect(visible).to.be.true;
                        done();
            });

        });
    });
    after(function(done) {
        client.end();
        done();
    });
});
/*
describe('test saving', function(){

    before(function(done) {
        client.init().url('http://127.0.0.1:8000/index.html', done);
    });
    
        
        it('', function(done){
            client.pause(500)
                .click("#hint-2-1");
            done();
                //.setValue("#text_area_draw", codeString)
                // .click("#save_as_button")
                // .setValue("#prompt_text_area", testFileName)
                // .click("#ok_button")
                // .click("#hint-1-1")
                //.getValue("#text_area_draw", function(value){
                    //console.log(value);
                    //done();
                //expect(value).not.to.be(codeString);
                //});
           /*
            client.click("#load_button")
                .click(testFileName);
            
            expect(true).to.be.false;

            done();
            
        });

    });
    
    after(function(done) {
        client.end();
        done();
    });

});
    */

// to do
// click on #hint-2-1
// insert following string in update
// context.fillStyle = 'green'; context.fillRect(10, 10, 10, 10);
// saveAs "test"
// reload page
// click on load button
// select "test" file
// check that string in update matches string input previously
// delete test file after test
