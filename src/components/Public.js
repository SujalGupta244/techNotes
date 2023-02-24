import React from 'react'
import { Link } from 'react-router-dom'

const Public = () => {
    const content = (
        <section className='public'>
            <header>
                <h1>Welcome to <span className='nowrap'>MERN Stack</span></h1>
            </header>
            <main className="public__main">
                <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus, non repudiandae! Minima, dicta illum necessitatibus eius neque porro architecto hic!
                </p>
                <address className='public__addr'>
                    Sujal gupta <br />
                    203/6 <br />
                    meerut , UP <br />
                    <a href="tel:+918218680140">+91 8218680140</a>
                </address>
                <br />
                <h3>Owner: Sujal gupta</h3>
            </main>
            
            <footer className=''>
                <Link to="/login">Employee Login</Link>
            </footer>
        </section>
    )
    return content;
}

export default Public