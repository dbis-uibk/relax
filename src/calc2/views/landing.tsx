/*** Copyright 2018 Johannes Kessler
*
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import * as $ from 'jquery';
import * as React from 'react';
import { Link } from 'react-router-dom';
import './landing.css';
import { Navigation } from '../components/navigation';
import { NavigationMobile } from '../components/navigation-mobile';


export class Landing extends React.Component {
	componentDidMount() {
		$('#exec1').click(function () {
			$(this).addClass('hidden');
			$(this).next().removeClass('hidden');
		});
	}

	render() {
		return (
			<div className="view-max">
			<Navigation></Navigation>
			<NavigationMobile></NavigationMobile>
			<div className="view-content">
			<div className="container">
			<div className="row">
			<div className="col-md-12">
						<div className="jumbotron" id="landing-header-bar">
							<div className="col-md-12 ct" id="logos">
								<a href="http://dbis-informatik.uibk.ac.at/" target="_blank"><img
									src="assets/logos/Logos_blue_large.png" alt="Databases and Information Systems (DBIS)"
									width="159" height="120" /></a>
								<a href="http://www.uibk.ac.at/" target="_blank"><img src="assets/logos/Logos_uni_uni_2017_rgb_transparent.png"
									alt="University of Innsbruck" width="300"
									height="120" /></a>
							</div>
							<div className="col-md-12 ct">
								<h1 id="heading">RelaX - relational algebra calculator</h1>
								<p>calculates any relational algebra statement like <code><span>( &sigma; <sub>a &gt; 42</sub> ( A ) ) <span className="math">⋈</span> ( &pi; <sub>a,b</sub> ( B ) )</span></code> on a set of relations.</p>
							</div>
							<div className="col-md-12 ct">
								<Link className="btn btn-primary btn-lg getStartedBtn" role="button" to="/relax/calc">Get Started</Link>
							</div>
						</div>

						<h2>What is the relational algebra calculator?</h2>

						<p>If you want to learn SQL you take a database system and try some queries.
							<br />But if you want to learn relational algebra what do you use? Pen and paper?</p>

						<p>The relational algebra calculator helps you learn relational algebra (RelAlg) by executing it.</p>

						<div className="example">
							{/*
							Students = {
								stId, name
								1, John
								2, Mike
								3, Lisa
								4, Julia
							}
							Subjects = {
								suId, name
								0, Computing
								1, Maths
								2, English
								3, History
							}
							Marks = {
								suId, stId, mark
								0, 1, A
								0, 2, B
								0, 3, C
								0, 4, A
								2, 2, A
								3, 2, F
								4, 1, C
							}

							pi studentName, subjectName, mark
							rho st.name->studentName, su.name->subjectName
							(
								rho su Subjects
									join sigma mark >= 'C' rho m Marks
										join m.stId = st.stId rho st Students
							)
							*/}

							Subjects =
							<div className="scroll-x">
							<table className="table table-condensed table-inline">
								<thead>
									<tr>
										<th>suId</th>
										<th>name</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td><span className="number">0</span></td>
										<td><span className="string">Computing</span></td>
									</tr>
									<tr>
										<td><span className="number">1</span></td>
										<td><span className="string">Maths</span></td>
									</tr>
									<tr>
										<td><span className="number">2</span></td>
										<td><span className="string">English</span></td>
									</tr>
									<tr>
										<td><span className="number">3</span></td>
										<td><span className="string">History</span></td>
									</tr>
								</tbody>
							</table>
							</div>
							
							Students =
							<div className="scroll-x">
							<table className="table table-condensed table-inline">
								<thead>
									<tr>
										<th>stId</th>
										<th>name</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td><span className="number">1</span></td>
										<td><span className="string">John</span></td>
									</tr>
									<tr>
										<td><span className="number">2</span></td>
										<td><span className="string">Mike</span></td>
									</tr>
									<tr>
										<td><span className="number">3</span></td>
										<td><span className="string">Lisa</span></td>
									</tr>
									<tr>
										<td><span className="number">4</span></td>
										<td><span className="string">Julia</span></td>
									</tr>
								</tbody>
							</table>
							</div>
							
							Marks =
							<div className="scroll-x">
							<table className="table table-condensed table-inline">
								<thead>
									<tr>
										<th>suId</th>
										<th>stId</th>
										<th>mark</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td><span className="number">0</span></td>
										<td><span className="number">1</span></td>
										<td><span className="string">A</span></td>
									</tr>
									<tr>
										<td><span className="number">0</span></td>
										<td><span className="number">2</span></td>
										<td><span className="string">B</span></td>
									</tr>
									<tr>
										<td><span className="number">0</span></td>
										<td><span className="number">3</span></td>
										<td><span className="string">C</span></td>
									</tr>
									<tr>
										<td><span className="number">0</span></td>
										<td><span className="number">4</span></td>
										<td><span className="string">A</span></td>
									</tr>
									<tr>
										<td><span className="number">2</span></td>
										<td><span className="number">2</span></td>
										<td><span className="string">A</span></td>
									</tr>
									<tr>
										<td><span className="number">3</span></td>
										<td><span className="number">2</span></td>
										<td><span className="string">F</span></td>
									</tr>
									<tr>
										<td><span className="number">4</span></td>
										<td><span className="number">1</span></td>
										<td><span className="string">C</span></td>
									</tr>
								</tbody>
							</table>
							</div>
							
							<br />

							<div>
								<span><span className="math"> π </span><sub> studentName, subjectName, mark </sub>( <span><span
									className="math"> ρ </span><sub> studentName←st.name, subjectName←su.name </sub>( <span>( <span>( <span><span
										className="math"> ρ </span><sub> su </sub>( <span><span
											className="math">Subjects</span></span> )</span> )<span
												className="math"> ⨝ </span><sub> </sub>( <span><span className="math"> σ </span><sub>
													mark≥'C' </sub>( <span><span className="math"> ρ </span><sub> m </sub>( <span><span className="math">Marks</span></span> )</span> )</span> )</span> )<span
														className="math"> ⨝ </span><sub> m.stId=st.stId </sub>( <span><span className="math"> ρ </span><sub>
															st </sub>( <span><span className="math">Students</span></span> )</span> )</span> )</span> )</span>
							</div>
							=
							<button type="button" className="btn" id="exec1">execute</button>
							<div className="scroll-x">
							<table className="table table-condensed table-inline hidden">
								<thead>
									<tr>
										<th>st.studentName</th>
										<th>su.subjectName</th>
										<th>m.mark</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td><span className="string">Lisa</span></td>
										<td><span className="string">Computing</span></td>
										<td><span className="string">C</span></td>
									</tr>
									<tr>
										<td><span className="string">Mike</span></td>
										<td><span className="string">History</span></td>
										<td><span className="string">F</span></td>
									</tr>
								</tbody>
							</table>
							</div>
						</div>

						<h2>Calculator features:</h2>
						<ul>
							<li>supports most common operators
								<ul>
									<li>projection</li>
									<li>selection</li>
									<li>rename relations</li>
									<li>rename columns</li>
									<li>group by</li>
									<li>intersect</li>
									<li>union</li>
									<li>set difference</li>
									<li>cross join</li>
									<li>theta join</li>
									<li>natural join</li>
									<li>natural left outer join</li>
									<li>natural right outer join</li>
									<li>natural full outer join</li>
									<li>theta left outer join</li>
									<li>theta right outer join</li>
									<li>theta full outer join</li>
									<li>left semi join</li>
									<li>right semi join</li>
									<li>anti join join</li>

									<li>order by</li>
									<li>duplicate elimination (on bags/multisets)</li>
								</ul>
							</li>
							<li>runs in any modern browser. no plugins needed</li>
							<li>text based approach. lets you write RelAlg as easy as SQL</li>
							<li>code editor with syntax highlighting and code completion</li>
							<li>pre defined sets of relations</li>
							<li>visualize statement in a operator tree</li>
							<li>plain text alternatives for special symbols like &sigma; or <span className="math">⋈</span></li>
							<li>variables can be used to simplify expressions</li>
							<li>new temporal relations can be declared in the statement</li>
							<li>sql like comments</li>
							<li>arbitrary boolean expressions in conditions</li>
							<li>operations keep original order for better traceability</li>
							<li>translates simple SQL-statements to RelAlg
								<ul>
									<li>no support for correlated sub-statements</li>
								</ul>
							</li>
						</ul>

						<h2>Available data</h2>
						You can either use one of the following datasets or create a new one.
						<div className="scroll-x">
						<table className="table">
							<thead>
								<tr>
									<th>Name</th>
									<th>Source</th>
									<th>Language</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td>Kemper Datenbanksysteme</td>
									<td><a href="http://www3.in.tum.de/teaching/bookDBMSeinf/">Alfons Kemper, André Eickler:
									Datenbanksysteme: Eine Einführung 8. Auflage</a>, Seite 84, Abbildung 3.8
								</td>
									<td>de</td>
								</tr>
								<tr>
									<td>UIBK - KursDB</td>
									<td>Tables from and for the lecture <a
										href="http://dbis-informatik.uibk.ac.at/249-0-VO-Datenbanksysteme.html" target="_blank">Databases:
									Foundations, Data Models and System Concepts - University of Innsbruck</a> chapter 3
								</td>
									<td>de</td>
								</tr>
								<tr>
									<td>UIBK - R, S, T</td>
									<td>Tables from and for the lecture <a
										href="http://dbis-informatik.uibk.ac.at/249-0-VO-Datenbanksysteme.html" target="_blank">Databases:
									Foundations, Data Models and System Concepts - University of Innsbruck</a> chapter 3
								</td>
									<td>de</td>
								</tr>
								<tr>
									<td>The Complete Book - Exercise 2.4.1</td>
									<td>Sample Data from
									<a href="http://infolab.stanford.edu/~ullman/dscb.html">Database Systems The Complete Book 2nd
										Edition by Hector Garcia-Molina, Jeff Ullman, and Jennifer Widom</a>:
									Exercise 2.4.1 Page 52-55
								</td>
									<td>en</td>
								</tr>
								<tr>
									<td>The Complete Book - Exercise 2.4.3</td>
									<td>Sample Data from
									<a href="http://infolab.stanford.edu/~ullman/dscb.html">Database Systems The Complete Book 2nd
										Edition by Hector Garcia-Molina, Jeff Ullman, and Jennifer Widom</a>:
									Exercise 2.4.1 Page 55-57
								</td>
									<td>en</td>
								</tr>
							</tbody>
						</table>
						</div>

						<h2>What it is not:</h2>

						<p>The tool is not meant to be a full database system.
							The goal of the implementation was to create a tool to support people to learn RelAlg.
						</p>

						<div className="scroll-x">
						<table className="table table-condensed">
							<thead>
								<tr>
									<th>&nbsp;</th>
									<th>Pen and Paper</th>
									<th>relational algebra calculator</th>
									<th>MySQL</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<th>SQL support</th>
									<td><span className="fa fa-check"></span> yes :-)</td>
									<td><span className="fa fa-check"></span> basic SQL</td>
									<td><span className="fa fa-check"></span> yes</td>
								</tr>
								<tr>
									<th>relational algebra</th>
									<td><span className="fa fa-check"></span> yes</td>
									<td><span className="fa fa-check"></span> yes</td>
									<td><span className="fa fa-times"></span> no</td>
								</tr>
								<tr>
									<th>relational algebra on bags/multisets</th>
									<td><span className="fa fa-check"></span> yes</td>
									<td><span className="fa fa-check"></span> yes</td>
									<td><span className="fa fa-times"></span> no</td>
								</tr>
								<tr>
									<th>use variables for RelAlg</th>
									<td><span className="fa fa-check"></span> yes</td>
									<td><span className="fa fa-check"></span> yes</td>
									<td><span className="fa fa-times"></span> no</td>
								</tr>
								<tr>
									<th>large datasets</th>
									<td><span className="fa fa-times"></span> no</td>
									<td><span className="fa fa-times"></span> no</td>
									<td><span className="fa fa-check"></span> yes</td>
								</tr>
								<tr>
									<th>query plan</th>
									<td><span className="fa fa-times"></span> no</td>
									<td><span className="fa fa-check"></span> yes</td>
									<td><span className="fa fa-times"></span> no</td>
								</tr>
								<tr>
									<th>intermediate results</th>
									<td><span className="fa fa-times"></span> no</td>
									<td><span className="fa fa-check"></span> yes</td>
									<td><span className="fa fa-times"></span> no</td>
								</tr>
								<tr>
									<th>iterative working</th>
									<td><span className="fa fa-times"></span> no</td>
									<td><span className="fa fa-check"></span> yes</td>
									<td><span className="fa fa-check"></span> yes</td>
								</tr>
							</tbody>
						</table>
						</div>

						<h2 id="changelog">Changelog</h2>
						<ul>
							<li>0.28 - Released 01.09.2022
								<ul>
									<li>Added Dark Mode Support | #150</li>
									<li>Fixed capitalization in english | #78</li>
								</ul>
							</li>
							<li>0.27 - Released 20.08.2022
								<ul>
									<li>Added Dark Mode Support | #150</li>
									<li>Fixed capitalization in english | #78</li>
								</ul>
							</li>
							<li>0.26 - Released 17.07.2022
								<ul>
									<li>Execution time | #156</li>
								</ul>
							</li>
							<li>0.25 - Released 08.07.2022
								<ul>
									<li>Increased white space tolerance | #169</li>
								</ul>
							</li>
							<li>0.24 - Released 17.06.2022
								<ul>
									<li>Fixed problem when replacing multiple operators | #174</li>
								</ul>
							</li>
							<li>0.23 - Released 16.06.2022
								<ul>
									<li>Added dataset from OTH Regensburg - Webshop</li>
									<li>Fixed problem with inline relation editor | #173</li>
								</ul>
							</li>
							<li>0.22 - Released 01.06.2022
								<ul>
									<li>execution time has been added</li>
								</ul>
							</li>
							
							
							<li>0.21 - Released 26.05.2022
								<ul>
									<li>added option of downloading the result (jpg or csv)</li>
									<li>fixed typos and broken links in the documentation</li>
									<li>added warning messages on large cross joins</li>
									<li>fixed missed up attribute order on right outer joins</li>
									<li>fixed set difference</li>
									<li>fixed missing pages when displaying relations</li>
									<li>going forward the changelog will include dates</li>
									<li>added recently used gists</li>
								</ul>
							</li>
							
							
							
							
							<li>0.20
								<ul>
									<li>added option to automatically replace operators in relational algebra: all plaintext-syntax operators get replaced with the equivalent mathematical symbol or vice versa.</li>
								</ul>
							</li>
							<li>0.19
								<ul>
									<li>added datepicker to quickly insert a date literal</li>
								</ul>
							</li>
							<li>0.18
								<ul>
									<li>
										added support for the <a href="/relax/help#relalg-valueexpr">LIKE-operator</a> for SQL and
										relational algebra
										<br />e.g. <code>pi 'abc' like 'a%'-&gt;x R</code>
									</li>
									<li>added translation support for the calculator using <a href="http://i18next.com/"
										target="_blank">i18next</a>. This
allows easy translation of the main calculator into other languages.
									</li>
									<li>calculator is now available in <a href="calc.htm?lang=de">german</a></li>
									<li>ported project to ES2015 (it now gets transpiled to ES5 and packed using <a target="_blank"
										href="https://babeljs.io/">Babel.js</a>
										and <a target="_blank" href="http://browserify.org/">Browserify</a>)
									</li>
								</ul>
							</li>
							<li>0.17
								<ul>
									<li>fixed bug: inline-table-editor not working</li>
									<li>fixed bug: formula for !a was not working</li>
								</ul>
							</li>
							<li>0.16
								<ul>
									<li>disallow relational algebra keywords as column-/relation-names</li>
									<li>fixed precedence for <a href="/relax/help#relalg-valueexpr">CASE-WHEN-expressions</a></li>
									<li>added support for the SQL-92 <a href="/relax/help#relalg-valueexpr"><code>||</code>-concat
										operator</a></li>
									<li>added <code>except</code> as alternative syntax for the <a
										href="/relax/help#relalg-operations-subtraction">relational algebra set-difference
										operator</a></li>
									<li>
										fixed bug where <code>A=R join S A</code> was interpreted as
										<code>A=(R join S A)</code> instead of <code>A=(R join S) A</code>.
										<br />see <a href="/relax/help#relalg-operations-innerjoin">help page</a> for more information
									</li>
								</ul>
							</li>
							<li>0.15
								<ul>
									<li>
										added support for <a href="/relax/help#relalg-valueexpr">hour(), minute() and second()</a>
									</li>
									<li>
										added support for <a href="/relax/help#relalg-valueexpr">now()</a>
										<br />e.g. <code>pi hour(now())-&gt;x, minute(now())-&gt;y, second(now())-&gt;z ( R )</code>
									</li>
									<li>
										added support for <a href="/relax/help#relalg-valueexpr">n-ary concat</a>
										<br />e.g. <code>pi concat(b, '_', c)-&gt;x R</code>
									</li>
									<li>added support for WITH-clauses for SQL</li>
								</ul>
							</li>
							<li>0.14
								<ul>
									<li>improve error message for theta-joins with conflicting columns</li>
									<li>improve error message and added example for assignments without query error</li>
									<li>bugfix: calculator-tour did not work correctly for Edge on Windows 10</li>
								</ul>
							</li>
							<li>0.13
								<ul>
									<li>updated to CodeMirror version 5.1 with "experimental mobile support"</li>
									<li>
										added support for <a href="/relax/help#relalg-valueexpr">COALESCE()</a>
										<br />e.g. <code>pi coalesce(a, b, 1)-&gt;x R</code>, <code>select coalesce(a, b, 1) as x from
										R</code>
									</li>
									<li>
										added support for <a href="/relax/help#relalg-valueexpr">CASE WHEN</a>
										<br />e.g. <code>select case when a &gt; 3 then a+1 else a end as x from R</code>
									</li>
									<li>added support for complex union/intersect/except statements for SQL
										<br />e.g. <code>(select * from S union ( select * from T except select * from T )) order by
											1</code>
									</li>
								</ul>
							</li>
							<li>0.12
								<ul>
									<li>added support for more complex FROM-clauses for SQL
										<br />e.g. <code>select distinct * from R, (S natural join T)</code>
									</li>
									<li>simplify and link the syntax diagrams at the help page</li>
								</ul>
							</li>
							<li>0.11
								<ul>
									<li>added a tour to explain the main features of the tool to new users (using <a
										href="http://bootstraptour.com/" target="_blank">Bootstrap Tour</a>)
									</li>
									<li>added <a href="/relax/help#sql-reference">reference for SQL in the help section</a></li>
									<li>added support for USING clause for joins for SQL</li>
									<li>added support FETCH FIRST syntax (SQL:2008) for SQL
										<br />e.g. <code>select * from R offset 2 rows fetch first 10 rows only</code>
									</li>
									<li>allow DISTINCT on set operators for SQL</li>
									<li>bugfix: having should be allowed without group by if aggregation is used</li>
								</ul>
							</li>
							<li>0.10
								<ul>
									<li>added support for <a href="/relax/help#relalg-valueexpr">arithmetic expressions and
										functions</a> for SQL
										<br />e.g. <code>select distinct a+2 as x from R where length(b) &gt; 2</code>
									</li>
									<li>show warnings instead of errors when not using distinct or using all on set operators in
										SQL
									</li>
								</ul>
							</li>
							<li>0.9
								<ul>
									<li>added support for arithmetic operators and functions in <a href="/relax/help#relalg-valueexpr">(e.g
										boolean) expressions</a> for relational algebra
									</li>
									<li>projection supports <a href="/relax/help#relalg-operations-projection">expressions</a></li>
									<li>removed magic <a href="/relax/help#relalg-operations-projection">ROWNUM</a> column; <a
										href="/relax/help#relalg-valueexpr">ROWNUM()</a> is now a function
									</li>
									<li>tutorials for <a href="/relax/help#tutorial-user">users</a> and <a
										href="/relax/help#tutorial-maintainer">maintainers</a></li>
									<li>new braces handling in formula generation (braces are only placed if necessary)</li>
									<li>bugfix: rename not existent column was silently ignored</li>
									<li>syntax of dates has changed <code>1970-01-01</code> could not be used any more because it is
										ambiguous (arithmetic operaton or date).
										The SQL notation (<code>date('1970-01-01')</code>) is now used for the relational algebra
										mode.
									</li>
								</ul>
							</li>
							<li>0.8
								<ul>
									<li>grid editor for inline relations</li>
									<li>sql-dump import (beta)</li>
									<li>group editor</li>
									<li>changed the basic structure of the editors (internally)</li>
									<li>duplicate rows are removed in every step</li>
								</ul>
							</li>
						</ul>

						<h2>Who?</h2>

						<p>The relational algebra calculator was created by Johannes Kessler BSc at <a href="https://dbis-informatik.uibk.ac.at/1-1-Home.html">Databases and Information Systems Group</a> at the <a href="http://informatik.uibk.ac.at/">Institute of Computer Science</a> at the <a href="http://www.uibk.ac.at/index.html.en">University of Innsbruck</a> under supervision of Michael Tschuggnall PhD and Prof. Dr. Günther Specht</p>


						<h2>External resources</h2>

						<p>This tool was not written from scratch but many different external resources/frameworks/projects/libs are
							used.</p>

						<p>This is a list of resources/frameworks/projects/libs used for this tool (in alphabetical order) to give
							credit where credit is due and guide anyone interested to them without having to look through the
							code.</p>
						<ul>
							<li><a target="_blank" href="https://babeljs.io/">Babel JavaScript compiler</a></li>
							<li><a target="_blank" href="http://blanketjs.org/">blanket.js</a></li>
							<li><a target="_blank" href="http://botmonster.com/jquery-bootpag/">bootpag</a></li>
							<li><a target="_blank" href="http://getbootstrap.com/">Bootstrap</a></li>
							<li><a target="_blank" href="https://bootstrap-datepicker.readthedocs.org">bootstrap-datepicker</a></li>
							<li><a target="_blank" href="http://bootstraptour.com/">Bootstrap Tour</a></li>
							<li><a target="_blank" href="http://browserify.org/">Browserify</a></li>
							<li><a target="_blank" href="http://codemirror.net/">CodeMirror</a></li>
							<li><a target="_blank" href="http://codepen.io/Pestov/pen/BLpgm">CSS3 family tree by Ilya Pestov</a>
							</li>
							<li><a target="_blank" href="http://www.gnu.org/software/freefont/">FreeSans by GNU FreeFont</a></li>
							<li><a target="_blank" href="http://gruntjs.com/">Grunt</a></li>
							<li><a target="_blank" href="http://handlebarsjs.com/">handlebars</a></li>
							<li><a target="_blank" href="http://handsontable.com/">Handsontable</a></li>
							<li><a target="_blank" href="http://i18next.com/">i18next</a></li>
							<li><a target="_blank" href="http://jquery.com/">jQuery</a></li>
							<li><a target="_blank" href="https://github.com/chjj/marked">marked - a markdown parser</a></li>
							<li><a target="_blank" href="http://pegjs.org/">PEG.js - Parser Generator for JavaScript</a></li>
							<li><a target="_blank" href="http://qunitjs.com/">QUnit - js unit testing</a></li>
							<li><a target="_blank"
								href="https://github.com/tabatkins/railroad-diagrams">tabatkins/railroad-diagrams</a></li>
						</ul>
					</div>
			</div>
			</div>
			</div>
			</div>
		);
	}
}
