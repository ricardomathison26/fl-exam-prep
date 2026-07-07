import React, { useState, useEffect, useMemo } from "react";

// Florida Sales Associate (FREC/Pearson VUE) exam blueprint:
// 100 questions, 3.5 hours (210 min), 75 correct to pass.
// ~45 law, ~45 principles & practices, ~10 math.
const EXAM_SECONDS = 210 * 60;
const PASS_SCORE = 75;
const BLUEPRINT = { law: 45, pri: 45, math: 10 };

const SEC_NAME = { law: "FL & Federal Law", pri: "Principles & Practices", math: "Real Estate Math" };
const SEC_TAG = {
  law: "bg-sky-100 text-sky-900",
  pri: "bg-emerald-100 text-emerald-900",
  math: "bg-amber-100 text-amber-900",
};

const BANK = [
// ---------------- FLORIDA & FEDERAL LAW ----------------
{s:"law",t:"FREC",q:"How many members serve on the Florida Real Estate Commission (FREC)?",o:["5","7","9","11"],a:1,e:"Seven members appointed by the Governor and confirmed by the Senate: four licensed brokers, one broker or sales associate, and two consumer members. Terms are 4 years."},
{s:"law",t:"FREC",q:"How many FREC members must be consumer members who have never held a real estate license?",o:["One","Two","Three","Four"],a:1,e:"Two members must never have been licensees, and at least one commissioner must be 60 years of age or older."},
{s:"law",t:"FREC",q:"Which is a quasi-judicial power of FREC?",o:["Adopting administrative rules","Suspending or revoking a license","Setting license fees","Educating licensees"],a:1,e:"Disciplining licensees (fines, suspension, revocation) is quasi-judicial. Rulemaking and fee setting are quasi-legislative powers."},
{s:"law",t:"Discipline",q:"The maximum period for which FREC may suspend a license is:",o:["2 years","5 years","10 years","Permanently"],a:2,e:"Suspension may not exceed 10 years. Revocation is generally permanent."},
{s:"law",t:"Licensure",q:"How many hours of prelicense education (FREC Course I) must a sales associate applicant complete?",o:["45 hours","63 hours","72 hours","14 hours"],a:1,e:"63 hours plus a passing end-of-course exam. 45 hours is the post-license requirement; 72 hours is broker prelicense; 14 hours is continuing education."},
{s:"law",t:"Licensure",q:"A sales associate who fails to complete the 45-hour post-license course before the first license renewal:",o:["May renew by paying a late fee","Holds a license that becomes null and void","Is placed on involuntary inactive status for 2 years","Completes 14 hours of CE instead"],a:1,e:"The license becomes null and void. To practice again, the individual must requalify as a new applicant by retaking the 63-hour course and the state exam."},
{s:"law",t:"Licensure",q:"After the first renewal, a sales associate must complete how much continuing education each 2-year license period?",o:["45 hours","28 hours","14 hours","63 hours"],a:2,e:"14 hours of continuing education, including a core law component, every 2-year renewal cycle after the first renewal."},
{s:"law",t:"Licensure",q:"Which is a requirement for a Florida sales associate license?",o:["Florida residency","U.S. citizenship","Being at least 18 with a high school diploma or equivalent","A college degree"],a:2,e:"Applicants must be at least 18, hold a high school diploma or its equivalent, and have a Social Security number. Florida residency and U.S. citizenship are not required."},
{s:"law",t:"Licensure",q:"A license that remains involuntarily inactive for more than 2 years:",o:["Automatically renews","Becomes null and void","Converts to voluntary inactive status","May be reactivated with 14 hours of CE"],a:1,e:"After 2 years on involuntary inactive status the license expires. Within the first 12 months, 14 hours of CE reactivates it; between 12 and 24 months, a 28-hour reactivation course is required."},
{s:"law",t:"Licensure",q:"A Florida real estate license must be renewed every:",o:["Year","2 years","3 years","4 years"],a:1,e:"Licenses are issued for 2-year periods expiring March 31 or September 30."},
{s:"law",t:"Licensure",q:"A licensee from a mutual recognition state may obtain a Florida license by passing a Florida law exam consisting of:",o:["100 questions, 75 correct to pass","40 questions, 30 correct to pass","50 questions, 38 correct to pass","No exam is required"],a:1,e:"Mutual recognition applicants take a 40-question Florida law exam and must answer at least 30 correctly (75%)."},
{s:"law",t:"Licensure",q:"A license application remains valid for how long after receipt by the DBPR?",o:["6 months","1 year","2 years","5 years"],a:2,e:"The application is good for 2 years. The applicant must pass the state exam within that period."},
{s:"law",t:"Licensure",q:"A sales associate employed by an owner-developer with several affiliated subsidiaries, selling only the developer's properties, should hold:",o:["Multiple licenses","A group license","A broker license","No license is needed"],a:1,e:"A group license lets a sales associate work for affiliated entities under one owner-developer. Multiple licenses are available only to brokers."},
{s:"law",t:"Licensure",q:"Which licensee may hold multiple licenses?",o:["A sales associate working for two brokers","A broker qualifying separate brokerage entities","A broker associate","Any licensee with FREC approval"],a:1,e:"Only brokers may hold multiple licenses, one for each company they serve as broker. Sales associates may have only one employer."},
{s:"law",t:"Escrow",q:"A sales associate receives an earnest money deposit on Wednesday. The deposit must be delivered to the employing broker no later than the end of:",o:["Business Wednesday","The next business day (Thursday)","The third business day","The day before closing"],a:1,e:"A sales associate must deliver escrow funds to the broker by the end of the next business day after receipt."},
{s:"law",t:"Escrow",q:"A broker must place escrow funds into the escrow account no later than:",o:["The end of the next business day","The end of the third business day after the licensee received the funds","5 business days after receipt","The day of closing"],a:1,e:"Deposit is required by the end of the third business day following receipt of the funds by the brokerage."},
{s:"law",t:"Escrow",q:"A broker receives conflicting demands for a disputed escrow deposit. The broker must notify FREC in writing within:",o:["10 business days","15 business days","30 business days","45 calendar days"],a:1,e:"Notice to FREC is due within 15 business days of the last party's conflicting demand, and a settlement procedure must be started within 30 business days."},
{s:"law",t:"Escrow",q:"Which escrow dispute settlement procedure is conducted by FREC itself?",o:["Mediation","Arbitration","Litigation","Escrow disbursement order"],a:3,e:"FREC issues escrow disbursement orders (EDOs) directing who receives disputed sale escrow funds held by a broker. Mediation, arbitration, and litigation involve third parties or the courts."},
{s:"law",t:"Recovery Fund",q:"The maximum payment from the Real Estate Recovery Fund for a single transaction is:",o:["$25,000","$50,000","$150,000","$500,000"],a:1,e:"$50,000 per transaction and $150,000 total against any one licensee for multiple claims."},
{s:"law",t:"Recovery Fund",q:"When the Recovery Fund pays a judgment against a licensee, the license is:",o:["Revoked permanently","Automatically suspended until the fund is repaid with interest","Unaffected","Placed on probation for 2 years"],a:1,e:"The license is suspended automatically and is not reinstated until the licensee repays the fund in full, plus interest."},
{s:"law",t:"Discipline",q:"Performing real estate services for compensation without a license in Florida is:",o:["A second-degree misdemeanor","A first-degree misdemeanor","A third-degree felony","A civil infraction only"],a:2,e:"Unlicensed activity is a third-degree felony, punishable by up to a $5,000 fine and up to 5 years in prison."},
{s:"law",t:"Discipline",q:"The maximum administrative fine FREC may impose is:",o:["$500 per count","$1,000 per count","$5,000 per count","$10,000 per count"],a:2,e:"FREC may impose an administrative fine of up to $5,000 for each count or separate offense."},
{s:"law",t:"Discipline",q:"For a first-time minor violation that causes no consumer harm, the DBPR would most likely issue a:",o:["Formal complaint","Notice of noncompliance","Summary suspension","Revocation order"],a:1,e:"A notice of noncompliance is a warning for a first-time minor violation. Citations with set fines apply to other specified minor violations."},
{s:"law",t:"Discipline",q:"A complaint filed with the DBPR is 'legally sufficient' if it:",o:["Is notarized","Alleges a violation of a Florida statute, DBPR rule, or FREC rule","Is filed by a Florida resident","Involves damages over $5,000"],a:1,e:"Legal sufficiency means the alleged facts, if true, would violate the law or rules. Anonymous complaints can qualify under certain conditions."},
{s:"law",t:"Discipline",q:"Probable cause in a disciplinary case is determined by:",o:["The full seven-member Commission","A probable cause panel of at least two FREC members","The Division of Real Estate director","A circuit court judge"],a:1,e:"A panel of at least two commissioners reviews the investigative report and decides whether probable cause exists to file a formal complaint."},
{s:"law",t:"Discipline",q:"A licensee wishing to appeal a FREC final order must seek judicial review within:",o:["10 days","20 days","30 days","90 days"],a:2,e:"A petition for review must be filed with the district court of appeal within 30 days after the final order is rendered."},
{s:"law",t:"Discipline",q:"A licensee found guilty of a crime must notify the DBPR within how many days of conviction or plea?",o:["10 days","30 days","60 days","90 days"],a:1,e:"Written notice is required within 30 days of being convicted or found guilty of, or pleading guilty or nolo contendere to, a crime."},
{s:"law",t:"Office & Records",q:"A licensee who changes residence address must notify the DBPR within:",o:["48 hours","10 days","30 days","60 days"],a:1,e:"Address changes must be reported within 10 days."},
{s:"law",t:"Office & Records",q:"Brokers must retain transaction and escrow records for at least:",o:["2 years","3 years","5 years","7 years"],a:2,e:"Records must be kept for 5 years, or 2 years after litigation concludes if beyond that period."},
{s:"law",t:"Office & Records",q:"A broker's office entrance sign must include:",o:["The broker's name, trade name if any, and the words Licensed Real Estate Broker","Only the trade name","The names of all sales associates","The broker's license number only"],a:0,e:"The sign must show the broker's name, the trade name (if one is used), and 'Licensed Real Estate Broker' or 'Lic. Real Estate Broker'."},
{s:"law",t:"Advertising",q:"An advertisement that fails to include the licensed name of the brokerage firm is:",o:["Permitted for rentals","A blind ad, which is prohibited","Allowed on the internet only","Legal if the associate's name appears"],a:1,e:"All brokerage advertising must include the licensed name of the brokerage firm; omitting it creates an illegal blind ad."},
{s:"law",t:"Compensation",q:"A sales associate may lawfully receive real estate compensation from:",o:["Any party to the transaction","Only the employing broker","The title company","Another brokerage's broker"],a:1,e:"Sales associates and broker associates may be paid only by the broker (or brokerage entity) under whom they are registered."},
{s:"law",t:"Compensation",q:"Which payment is lawful?",o:["A commission split with an unlicensed friend for a referral","A disclosed rebate to a buyer in the transaction, paid through the broker","A fee paid directly to another firm's sales associate","A bonus from the seller directly to the sales associate"],a:1,e:"Rebates to a party in the transaction are lawful if fully disclosed to all interested parties. Sharing compensation with unlicensed persons for real estate services is illegal."},
{s:"law",t:"Relationships",q:"In Florida, it is presumed that a licensee is operating as a:",o:["Single agent","Transaction broker","Nonrepresentative","Designated agent"],a:1,e:"Transaction brokerage is the presumed relationship unless a single agent or no brokerage relationship is established in writing."},
{s:"law",t:"Relationships",q:"Which duty is owed by a single agent but NOT by a transaction broker?",o:["Dealing honestly and fairly","Loyalty","Accounting for all funds","Skill, care, and diligence"],a:1,e:"Single agents owe fiduciary duties including loyalty, obedience, and full confidentiality to their principal. A transaction broker owes only limited confidentiality and no loyalty."},
{s:"law",t:"Relationships",q:"How many statutory duties does a single agent owe the principal?",o:["3","7","9","12"],a:2,e:"Nine duties, including loyalty, confidentiality, obedience, full disclosure, accounting, skill/care/diligence, presenting all offers, disclosing known facts materially affecting residential property value, and dealing honestly and fairly. A transaction broker owes seven; no brokerage relationship, three."},
{s:"law",t:"Relationships",q:"Before changing from single agent to transaction broker with the same customer, a licensee must obtain:",o:["FREC approval","The principal's consent, signed or initialed on the transition disclosure","A court order","Nothing; the change is automatic"],a:1,e:"The consent-to-transition language must be signed or initialed by the principal before the licensee may make the change."},
{s:"law",t:"Relationships",q:"Which duty is owed to a customer even under a no brokerage relationship?",o:["Loyalty","Obedience","Disclosing known facts that materially affect the value of residential property and are not readily observable","Presenting all offers"],a:2,e:"The three no-brokerage-relationship duties are dealing honestly and fairly, disclosing known material facts about residential property, and accounting for all funds."},
{s:"law",t:"Relationships",q:"Designated sales associates may be appointed only in:",o:["Residential sales of any price","Nonresidential transactions where the buyer and seller each have assets of at least $1 million","Commercial leases over $5 million","Transactions involving out-of-state parties"],a:1,e:"Two associates of the same broker may act as single agents for opposite parties only in nonresidential deals where each party has $1 million or more in assets and requests the arrangement in writing."},
{s:"law",t:"Relationships",q:"In a residential sale, the single agent disclosure must be given:",o:["At closing","Before or at the time of entering a listing or representation agreement, or before showing property, whichever occurs first","Within 3 days after a contract is signed","Only if the customer requests it"],a:1,e:"Written single agent (and no brokerage relationship) disclosures are required in residential sales before or at these first points of engagement."},
{s:"law",t:"Fair Housing",q:"The 1988 amendments to the federal Fair Housing Act added which protected classes?",o:["Race and color","Religion and sex","Familial status and handicap (disability)","Age and marital status"],a:2,e:"The original 1968 act covered race, color, religion, and national origin; sex was added in 1974; familial status and handicap were added in 1988."},
{s:"law",t:"Fair Housing",q:"The Civil Rights Act of 1866:",o:["Applies only to federally funded housing","Prohibits racial discrimination in all property transactions with no exceptions","Allows owner-occupant exemptions","Covers religion and sex"],a:1,e:"The 1866 act bars all racial discrimination in real property transactions, with no exemptions, as upheld in Jones v. Mayer (1968)."},
{s:"law",t:"Fair Housing",q:"Channeling prospective buyers toward or away from certain neighborhoods based on a protected class is:",o:["Blockbusting","Steering","Redlining","Puffing"],a:1,e:"Steering directs buyers by protected class. Blockbusting induces panic selling; redlining is lender discrimination by area."},
{s:"law",t:"Fair Housing",q:"Telling homeowners they should sell quickly because families of a particular ethnicity are moving into the neighborhood is:",o:["Steering","Blockbusting","Redlining","Permissible market advice"],a:1,e:"Blockbusting (panic peddling) means inducing sales by representing that entry of persons of a protected class will affect values. It is illegal."},
{s:"law",t:"Fair Housing",q:"A lender that refuses to make loans in certain neighborhoods regardless of applicant qualifications is engaged in:",o:["Redlining","Steering","Blockbusting","Warehousing"],a:0,e:"Redlining is discriminatory denial of credit based on the location or composition of a neighborhood."},
{s:"law",t:"Fair Housing",q:"A for-sale-by-owner exemption under the federal Fair Housing Act is lost when:",o:["The home is worth over $500,000","Discriminatory advertising is used or a real estate licensee is involved","The owner also owns a rental condo","The buyer finances with FHA"],a:1,e:"Exemptions never permit discriminatory advertising and disappear when a licensee participates. The 1866 act still bars racial discrimination in every case."},
{s:"law",t:"Fair Housing",q:"A complaint under the federal Fair Housing Act must be filed with HUD within:",o:["90 days","6 months","1 year","2 years"],a:2,e:"Complaints go to HUD within 1 year of the alleged act; civil suits may be filed within 2 years."},
{s:"law",t:"Finance Law",q:"Under TILA (Regulation Z), which advertising statement triggers full disclosure requirements?",o:["Low monthly payments","Only $10,000 down","Great financing available","The annual percentage rate (APR)"],a:1,e:"Trigger terms include the down payment amount, payment amounts, number of payments, term, or finance charges. General phrases and the APR alone are not triggers."},
{s:"law",t:"Finance Law",q:"RESPA primarily prohibits:",o:["High interest rates","Kickbacks and unearned fees in federally related residential loan closings","Balloon mortgages","Seller financing"],a:1,e:"RESPA applies to federally related loans on one- to four-unit residential property and bans kickbacks, unearned fees, and requiring a particular title insurer."},
{s:"law",t:"Finance Law",q:"Under TRID, the Closing Disclosure must be received by the borrower at least:",o:["1 business day before closing","3 business days before closing","7 business days before closing","At the closing table"],a:1,e:"The Closing Disclosure is due at least 3 business days before consummation; the Loan Estimate is due within 3 business days of application."},
{s:"law",t:"Landlord-Tenant",q:"Under the Florida Residential Landlord and Tenant Act, a landlord intending to claim part of a security deposit must send written notice within:",o:["15 days","30 days","45 days","60 days"],a:1,e:"Notice of a claim must be sent by certified mail within 30 days of the tenant vacating. If no claim is made, the deposit must be returned within 15 days."},
{s:"law",t:"Disclosures",q:"Florida law requires which disclosure on all contracts for sale (and certain rentals) of buildings?",o:["Mold history","Radon gas disclosure","Crime statistics","School zone ratings"],a:1,e:"A statutory radon disclosure statement must appear on at least one document delivered at or before execution of the contract for sale, or for rentals exceeding 45 days."},
{s:"law",t:"Disclosures",q:"Federal lead-based paint disclosure rules apply to residential housing built before:",o:["1968","1974","1978","1988"],a:2,e:"Sellers and landlords of pre-1978 housing must disclose known lead hazards, provide the EPA pamphlet, and give buyers a 10-day opportunity for a risk assessment."},
{s:"law",t:"Disclosures",q:"Under Johnson v. Davis, a home seller in Florida must disclose:",o:["Nothing; caveat emptor applies","Known facts that materially affect the value of residential property and are not readily observable","Only defects the buyer asks about","Only defects listed in the MLS"],a:1,e:"This duty applies to sellers and, by statute, to licensees in residential transactions."},
{s:"law",t:"Homestead",q:"Florida's constitutional homestead protection against forced sale covers up to:",o:["One-quarter acre anywhere","One-half acre inside a municipality or 160 acres outside","One acre statewide","Ten acres in any county"],a:1,e:"Homestead property is protected from forced sale by most creditors, with exceptions for property taxes, mortgages, and construction liens on the property itself."}
];

BANK.push(
// ---------------- PRINCIPLES & PRACTICES ----------------
{s:"pri",t:"Property",q:"Which is the most important test in determining whether an item is a fixture?",o:["Cost of the item","Intent of the parties","Size of the item","Age of the item"],a:1,e:"Courts weigh intent, method of attachment, adaptation to the real estate, and any agreement of the parties. Intent is the controlling test."},
{s:"pri",t:"Property",q:"Annually cultivated crops (emblements) are classified as:",o:["Real property","Personal property","Fixtures","Appurtenances"],a:1,e:"Fructus industriales are personal property even before harvest. Naturally growing trees and perennial plants are part of the real estate."},
{s:"pri",t:"Property",q:"Which is NOT part of an owner's bundle of rights?",o:["Disposition","Exclusion","Taxation","Possession"],a:2,e:"The bundle includes disposition, exclusion, enjoyment, possession, and control. Taxation is a government power, not an ownership right."},
{s:"pri",t:"Estates",q:"The most complete form of ownership, unlimited in duration and freely transferable, is:",o:["A life estate","Fee simple absolute","An estate for years","A remainder"],a:1},
{s:"pri",t:"Estates",q:"O grants a life estate to A, with title passing to B upon A's death. B holds:",o:["A reversion","A remainder interest","A leasehold","Fee simple absolute"],a:1,e:"Title passing to a third party creates a remainder. If title returned to grantor O, O would hold a reversion."},
{s:"pri",t:"Estates",q:"A tenant whose lease has expired remains in the apartment without the landlord's consent. The tenant holds a:",o:["Tenancy for years","Tenancy at will","Tenancy at sufferance","Freehold estate"],a:2,e:"A holdover tenant without consent is a tenant at sufferance, the lowest form of leasehold interest."},
{s:"pri",t:"Estates",q:"An estate (tenancy) for years:",o:["Requires notice to terminate","Has a definite beginning and ending date","Must last at least one year","Is a freehold estate"],a:1,e:"It terminates automatically on the stated end date, no notice needed, and may be shorter than one year despite the name."},
{s:"pri",t:"Ownership",q:"The distinguishing feature of a joint tenancy is:",o:["Unequal ownership shares","The right of survivorship","Separate titles for each owner","Automatic conversion to entireties upon marriage"],a:1,e:"Joint tenancy requires the four unities (possession, interest, time, title). A deceased tenant's share passes to the surviving joint tenants."},
{s:"pri",t:"Ownership",q:"Tenancy by the entireties may be created only by:",o:["Business partners","A married couple","Parent and child","Any two natural persons"],a:1,e:"It carries automatic survivorship, and neither spouse can convey or encumber the property without the other."},
{s:"pri",t:"Ownership",q:"Two unmarried investors take title together with no form of ownership stated. They hold as:",o:["Joint tenants","Tenants by the entireties","Tenants in common","Tenants at will"],a:2,e:"Tenancy in common is the presumed form. Each holds an undivided interest, shares may be unequal, and there is no survivorship."},
{s:"pri",t:"Ownership",q:"A condominium unit owner holds:",o:["Corporate stock and a proprietary lease","Fee simple title to the unit plus an undivided interest in the common elements","A leasehold interest only","Title to the land beneath the unit"],a:1,e:"Condominiums are created by recording a declaration. Stock plus a proprietary lease describes a cooperative."},
{s:"pri",t:"Ownership",q:"A purchaser of a cooperative apartment receives:",o:["A deed to the unit","Shares of stock in the corporation and a proprietary lease","Fee simple title","A certificate of title"],a:1,e:"The corporation owns the real estate; the buyer's interest is personal property."},
{s:"pri",t:"Encumbrances",q:"An easement appurtenant:",o:["Benefits a person rather than a parcel of land","Runs with the land and transfers with the dominant estate","Terminates when the servient estate is sold","Cannot be created in writing"],a:1,e:"It benefits the dominant estate and burdens the servient estate, passing automatically with conveyance of the dominant parcel."},
{s:"pri",t:"Encumbrances",q:"In Florida, an easement by prescription requires continuous, open, and adverse use for:",o:["7 years","10 years","20 years","30 years"],a:2,e:"Prescriptive easements require 20 years of adverse use. Adverse possession of title requires only 7 years, with color of title or payment of taxes."},
{s:"pri",t:"Encumbrances",q:"A neighbor's fence extends two feet across the lot line onto an adjoining owner's land. This is:",o:["An easement in gross","An encroachment","A license","A deed restriction"],a:1,e:"An encroachment is an unauthorized physical intrusion onto another's land, typically revealed by a survey."},
{s:"pri",t:"Liens",q:"Which lien has priority over all others regardless of recording date?",o:["A first mortgage","A real property tax lien","A construction (mechanic's) lien","A judgment lien"],a:1,e:"Property tax and special assessment liens are superior liens paid first at foreclosure."},
{s:"pri",t:"Liens",q:"A judgment lien is an example of a:",o:["Specific lien on one property","General lien attaching to all the debtor's property in the county where recorded","Voluntary lien","Superior lien"],a:1,e:"Mortgages, property tax liens, and construction liens are specific liens on a single property; judgments and IRS liens are general."},
{s:"pri",t:"Deeds",q:"Which is NOT required for a deed to be valid?",o:["Signature of the grantor","Signature of the grantee","Delivery and acceptance","A legally competent grantor"],a:1,e:"The grantee does not sign a deed and need not even be legally competent to receive title."},
{s:"pri",t:"Deeds",q:"In Florida, a deed conveying real property must be signed by the grantor in the presence of:",o:["A notary only","One witness","Two witnesses","Three witnesses"],a:2,e:"Florida requires two subscribing witnesses to the grantor's signature for a valid conveyance by deed."},
{s:"pri",t:"Deeds",q:"The deed giving the grantee the greatest protection is the:",o:["Quitclaim deed","Special warranty deed","Bargain and sale deed","General warranty deed"],a:3,e:"It contains full covenants (seisin, quiet enjoyment, against encumbrances, further assurance, warranty forever) covering the entire chain of title."},
{s:"pri",t:"Deeds",q:"The deed most commonly used to remove a cloud on title, conveying only whatever interest the grantor may have, is the:",o:["General warranty deed","Quitclaim deed","Special warranty deed","Guardian's deed"],a:1,e:"A quitclaim deed carries no covenants or warranties of any kind."},
{s:"pri",t:"Title",q:"To acquire title by adverse possession in Florida, possession must be open, notorious, and hostile for at least:",o:["5 years","7 years","10 years","20 years"],a:1,e:"Seven years, under color of title or with payment of property taxes, along with the other statutory requirements."},
{s:"pri",t:"Title",q:"Recording a deed in the county public records provides:",o:["Actual notice","Constructive notice","Implied notice","No legal notice"],a:1,e:"Recording gives constructive (legal) notice to the world. Actual notice comes from direct knowledge, such as inspecting the property."},
{s:"pri",t:"Title",q:"An owner's title insurance policy:",o:["Requires an annual premium","Protects against covered title defects that occurred before the policy date","Covers defects the owner creates after closing","Transfers automatically to the next buyer"],a:1,e:"A one-time premium buys protection against undiscovered past defects, up to the policy amount."},
{s:"pri",t:"Title",q:"In Florida, a surviving spouse's elective share of the deceased spouse's estate is:",o:["10%","30%","50%","100%"],a:1,e:"The surviving spouse may elect to take 30% of the elective estate regardless of the will's terms."},
{s:"pri",t:"Legal Descriptions",q:"A metes and bounds description must:",o:["Reference a recorded plat","Begin at and return to the point of beginning (POB)","Use section and township lines","Include the street address"],a:1,e:"The boundary must close by returning to the POB, following monuments, distances, and compass bearings."},
{s:"pri",t:"Legal Descriptions",q:"A section of land in the government survey system contains:",o:["36 square miles","640 acres","160 acres","43,560 square feet"],a:1,e:"One section is one square mile, or 640 acres. A township contains 36 sections; one acre is 43,560 square feet."},
{s:"pri",t:"Legal Descriptions",q:"The lot and block method of legal description relies on:",o:["A recorded plat map","Monuments and compass bearings","Principal meridians and base lines","Assessor parcel numbers"],a:0,e:"Subdivided land is described by lot and block numbers shown on a plat recorded in the public records."},
{s:"pri",t:"Contracts",q:"To be enforceable in court, a contract for the sale of real property must be:",o:["Notarized","Recorded","In writing and signed by the parties","Witnessed by two people"],a:2,e:"The statute of frauds requires written purchase and sale contracts and leases over one year. Listing agreements need not be written to be valid."},
{s:"pri",t:"Contracts",q:"An option contract is:",o:["Bilateral, binding both parties","Unilateral, binding only the optionor (owner)","Void unless recorded","An offer that may be withdrawn at any time"],a:1,e:"The optionee pays consideration for the right, but not the obligation, to buy within the option period."},
{s:"pri",t:"Contracts",q:"A seller responds to a buyer's offer by changing the price. The buyer's original offer is:",o:["Still open for acceptance","Terminated by the counteroffer","Automatically accepted","Converted to an option"],a:1,e:"A counteroffer rejects and extinguishes the original offer; the original offeror becomes the new offeree."},
{s:"pri",t:"Contracts",q:"A court order compelling a defaulting seller to convey the property as agreed is called:",o:["Rescission","Liquidated damages","Specific performance","Novation"],a:2,e:"Because land is unique, courts may order specific performance rather than limit the buyer to money damages."},
{s:"pri",t:"Contracts",q:"Substituting a new obligor for the original party, releasing the original party from liability, is:",o:["Assignment","Novation","Subordination","Subrogation"],a:1,e:"Under a mere assignment, the original party can remain secondarily liable; a novation extinguishes the old obligation."},
{s:"pri",t:"Listings",q:"Under an exclusive right of sale listing, the broker earns a commission:",o:["Only if the broker personally finds the buyer","If anyone, including the owner, sells the property during the listing term","Only if the property sells at full list price","Only after the buyer takes occupancy"],a:1,e:"This listing gives the broker the strongest protection. Under an exclusive agency listing, the owner may sell personally without paying."},
{s:"pri",t:"Listings",q:"Under an exclusive agency listing, the owner:",o:["May sell the property personally without owing a commission","Must pay the commission no matter who sells","May list concurrently with many brokers","Cannot cancel the listing"],a:0,e:"One broker is employed, but the owner reserves the right to sell without obligation. An open listing may be given to multiple brokers."},
{s:"pri",t:"Listings",q:"A written residential listing agreement in Florida must:",o:["Be recorded","Contain a definite expiration date and no automatic renewal provision","Last at least six months","Be notarized"],a:1,e:"It must also be signed by the seller, and a copy must be delivered to the seller within 24 hours of signing."},
{s:"pri",t:"Mortgages",q:"Florida is a lien theory state, which means:",o:["The lender holds legal title until the loan is repaid","The borrower holds title and the lender holds a lien against the property","Foreclosure is nonjudicial","A trustee holds title for the lender"],a:1,e:"In title theory states, lenders hold title through a deed of trust; in Florida, the mortgage creates only a lien."},
{s:"pri",t:"Mortgages",q:"The document containing the borrower's personal promise to repay the debt is the:",o:["Mortgage","Promissory note","Deed","Satisfaction"],a:1,e:"The note is the evidence of the debt; the mortgage pledges the property as security for that note."},
{s:"pri",t:"Mortgages",q:"The clause allowing a lender to demand full payment if the property is sold is the:",o:["Acceleration clause","Due-on-sale (alienation) clause","Defeasance clause","Subordination clause"],a:1,e:"Acceleration operates on default; defeasance defeats the lien when the debt is fully paid."},
{s:"pri",t:"Mortgages",q:"A buyer who purchases 'subject to' an existing mortgage:",o:["Becomes personally liable for the debt","Is not personally liable; the seller remains liable on the note","Releases the seller from all liability","Must qualify with the lender"],a:1,e:"Under an assumption, the buyer becomes personally liable; only a novation releases the original borrower."},
{s:"pri",t:"Mortgages",q:"Mortgage foreclosure in Florida is:",o:["Nonjudicial, by power of sale","A judicial process through the courts","Conducted by a trustee","Prohibited on investment property"],a:1,e:"Florida requires judicial foreclosure. The borrower may exercise the equity of redemption by paying the debt any time before the foreclosure sale."},
{s:"pri",t:"Mortgages",q:"A recorded notice that a lawsuit is pending which may affect title to a property is a:",o:["Lis pendens","Writ of execution","Deficiency judgment","Satisfaction of mortgage"],a:0,e:"Lis pendens gives constructive notice of pending litigation, such as a foreclosure action."},
{s:"pri",t:"Financing",q:"Which statement about government loan programs is correct?",o:["FHA makes loans directly to buyers","FHA insures loans and the VA guarantees loans","The VA insures loans and FHA guarantees them","Both agencies buy loans on the secondary market"],a:1,e:"FHA insures lenders against default (borrower pays MIP); the VA guarantees the top portion of eligible veterans' loans, often with no down payment."},
{s:"pri",t:"Financing",q:"On conventional loans, private mortgage insurance is generally required when the loan-to-value ratio exceeds:",o:["70%","80%","90%","95%"],a:1,e:"PMI protects the lender on high-LTV conventional loans and is subject to cancellation as equity grows."},
{s:"pri",t:"Financing",q:"The interest rate on an adjustable-rate mortgage is determined by:",o:["Index plus margin","Prime rate minus points","Margin minus caps","Discount rate plus origination fees"],a:0,e:"The rate floats with a published index; the lender's fixed margin is added. Caps limit periodic and lifetime changes."},
{s:"pri",t:"Financing",q:"A developer finances an entire subdivision with one mortgage covering all lots and obtains releases as individual lots sell. This is a:",o:["Package mortgage with an escalation clause","Blanket mortgage with a partial release clause","Wraparound mortgage","Open-end mortgage"],a:1,e:"A blanket mortgage covers multiple parcels; the partial release clause frees lots from the lien as they are paid off."},
{s:"pri",t:"Financing",q:"A mortgage secured by the real property plus appliances and furnishings is a:",o:["Blanket mortgage","Package mortgage","Purchase-money mortgage","Participation mortgage"],a:1,e:"Package mortgages include personal property, common in furnished condo sales."},
{s:"pri",t:"Financing",q:"When a seller finances part of the purchase price and takes back a mortgage from the buyer, this is a:",o:["Purchase-money mortgage","Wraparound trust","Bridge loan","Reverse mortgage"],a:0,e:"Seller financing secured by the property sold is a purchase-money mortgage."},
{s:"pri",t:"Financing",q:"The primary function of the secondary mortgage market is to:",o:["Make loans directly to consumers","Buy and sell existing mortgage loans, providing liquidity to lenders","Insure loans against default","Set maximum interest rates"],a:1,e:"Fannie Mae and Freddie Mac purchase loans from originators; Ginnie Mae guarantees mortgage-backed securities."},
{s:"pri",t:"Financing",q:"The benchmark total obligations ratio (TOR) for a conventional loan is:",o:["28%","31%","36%","43%"],a:2,e:"Conventional benchmarks: 28% housing expense ratio, 36% total obligations. FHA benchmarks are 31% and 43%."},
{s:"pri",t:"Financing",q:"Lenders charge discount points to:",o:["Cover appraisal costs","Increase the effective yield on the loan","Reduce the borrower's principal balance","Pay the broker's commission"],a:1,e:"One point equals 1% of the loan amount. As a rule of thumb, each point raises the lender's yield by about one-eighth of one percent."},
{s:"pri",t:"Appraisal",q:"The four characteristics required for something to have value are:",o:["Demand, utility, scarcity, transferability","Density, use, size, title","Desire, usefulness, supply, tenancy","Demand, uniqueness, stability, transfer"],a:0,e:"Remembered as DUST. All four must be present for market value to exist."},
{s:"pri",t:"Appraisal",q:"The appraisal principle stating a buyer will pay no more for a property than the cost of acquiring an equally desirable substitute is:",o:["Anticipation","Substitution","Conformity","Contribution"],a:1,e:"Substitution is the foundation of the sales comparison approach."},
{s:"pri",t:"Appraisal",q:"Highest and best use of a site must be:",o:["The property's current use","Legally permissible, physically possible, financially feasible, and maximally productive","The use producing the largest structure","Whatever the owner prefers"],a:1},
{s:"pri",t:"Appraisal",q:"In the sales comparison approach, a comparable has a pool and the subject does not. The appraiser:",o:["Adds the pool's value to the subject","Subtracts the pool's contributory value from the comparable's sale price","Ignores the difference","Subtracts the pool's value from the subject"],a:1,e:"Adjustments are always made to the comparable, never to the subject: if the comparable is better, subtract; if inferior, add."},
{s:"pri",t:"Appraisal",q:"Loss in value caused by factors outside the property, such as a nearby landfill, is:",o:["Physical deterioration","Functional obsolescence","External (economic) obsolescence","Curable depreciation"],a:2,e:"External obsolescence is always incurable because the owner cannot control offsite causes. An outdated floor plan is functional obsolescence."},
{s:"pri",t:"Appraisal",q:"When calculating net operating income, which is NOT deducted from effective gross income?",o:["Property taxes","Maintenance costs","Mortgage debt service","Hazard insurance"],a:2,e:"NOI excludes debt service, income taxes, and depreciation. Vacancy and collection losses are deducted from potential gross income to get effective gross income."},
{s:"pri",t:"Appraisal",q:"The gross rent multiplier (GRM) is calculated by dividing:",o:["Annual rent by sale price","Sale price by gross monthly rent","NOI by the capitalization rate","Monthly rent by operating expenses"],a:1,e:"GRM uses monthly rent; the gross income multiplier (GIM) uses annual income."},
{s:"pri",t:"Appraisal",q:"An appraisal for a federally related transaction must be performed by:",o:["Any real estate licensee","A state-licensed or state-certified appraiser","The lender's loan officer","A FREC-approved broker"],a:1,e:"Real estate licensees may prepare CMAs and broker price opinions for compensation but may not call them appraisals, and must follow USPAP when appraising."},
{s:"pri",t:"Business Brokerage",q:"In the sale of a business, the intangible asset arising from reputation and an established customer base is:",o:["Goodwill","Chattel","Working capital","Inventory"],a:0,e:"Going-concern value includes tangible assets plus intangibles such as goodwill."},
{s:"pri",t:"Taxes",q:"Ad valorem property taxes are based on:",o:["The owner's income","The just (market) value of the property assessed as of January 1","The original purchase price","Square footage only"],a:1,e:"The county property appraiser assesses value each January 1; ad valorem means according to value."},
{s:"pri",t:"Taxes",q:"A one-time levy charged only to properties that benefit from a specific public improvement, such as a new sewer line, is a:",o:["Special assessment","Millage increase","Ad valorem tax","Documentary stamp tax"],a:0,e:"Special assessments are specific, involuntary liens apportioned by benefit received."},
{s:"pri",t:"Taxes",q:"Florida's Save Our Homes provision caps annual increases in a homesteaded property's assessed value at:",o:["3% or the change in CPI, whichever is less","5% flat","10% flat","No cap applies"],a:0,e:"The cap applies to homestead property; accumulated savings may be ported to a new homestead within statutory limits."},
{s:"pri",t:"Taxes",q:"A married couple filing jointly may exclude how much gain from the sale of a principal residence?",o:["$125,000","$250,000","$500,000","$1,000,000"],a:2,e:"Section 121 allows $500,000 for joint filers ($250,000 single) if they owned and used the home as a principal residence for 2 of the previous 5 years."},
{s:"pri",t:"Taxes",q:"For federal income tax purposes, residential rental buildings are depreciated over:",o:["15 years","27.5 years","39 years","50 years"],a:1,e:"Nonresidential property uses 39 years. Land is never depreciable."},
{s:"pri",t:"Taxes",q:"In a Section 1031 like-kind exchange, cash or other unlike property received is called:",o:["Boot, and it is taxable","Basis","Tax-free equity","Goodwill"],a:0,e:"1031 exchanges defer gain on qualifying investment or business real property, but boot received is taxed in the year of the exchange."},
{s:"pri",t:"Planning",q:"Zoning ordinances are an exercise of:",o:["Eminent domain, requiring compensation","Police power, requiring no compensation","Escheat","Riparian rights"],a:1,e:"Police power regulates for health, safety, and welfare without compensation. Eminent domain takes property for public use with just compensation through condemnation."},
{s:"pri",t:"Planning",q:"An owner whose oddly shaped lot cannot meet setback requirements may seek relief through a:",o:["Special exception","Variance","Comprehensive plan amendment","Nonconforming use permit"],a:1,e:"A variance relieves undue hardship unique to the parcel. A special exception is a use already permitted by the ordinance subject to conditions."},
{s:"pri",t:"Planning",q:"A store that lawfully existed before its area was rezoned residential may continue operating as a:",o:["Variance","Special exception","Nonconforming use","Spot zone"],a:2,e:"Legal nonconforming (grandfathered) uses may continue but typically cannot be expanded or rebuilt if destroyed."},
{s:"pri",t:"Planning",q:"A strip of parkland separating a residential neighborhood from an industrial district is a:",o:["Buffer zone","Setback","Plat","Easement in gross"],a:0,e:"Buffer zones ease the transition between incompatible land uses."},
{s:"pri",t:"Environment",q:"Asbestos poses the greatest health hazard when it is:",o:["Encapsulated","Friable (crumbling and airborne)","Painted over","Sealed behind drywall"],a:1,e:"Friable asbestos releases inhalable fibers. Encapsulation is a common remediation method. Radon, by contrast, is a naturally occurring radioactive gas entering from the soil."}
);

BANK.push(
// ---------------- REAL ESTATE MATH ----------------
{s:"math",t:"Commission",q:"A home sells for $285,000 with a 6% commission split 50/50 between the listing and selling offices. The selling sales associate receives 60% of the office's share. How much does the associate earn?",o:["$4,275","$5,130","$8,550","$10,260"],a:1,e:"$285,000 x 0.06 = $17,100 total. Office share: $17,100 x 0.50 = $8,550. Associate: $8,550 x 0.60 = $5,130."},
{s:"math",t:"Commission",q:"A property sells for $350,000 at 6% commission. The listing office keeps 55% and the selling office 45%. The selling associate is on a 50% split with the broker. The selling associate earns:",o:["$4,725","$5,775","$9,450","$11,550"],a:0,e:"$350,000 x 0.06 = $21,000. Selling office: $21,000 x 0.45 = $9,450. Associate: $9,450 x 0.50 = $4,725."},
{s:"math",t:"Area",q:"A rectangular parcel measures 660 feet by 660 feet. How many acres does it contain?",o:["5 acres","8 acres","10 acres","15 acres"],a:2,e:"660 x 660 = 435,600 sq ft. 435,600 / 43,560 = 10 acres."},
{s:"math",t:"Area",q:"A lot measuring 90 feet by 120 feet sells for $12.50 per square foot. The price is:",o:["$112,500","$121,500","$135,000","$150,000"],a:2,e:"90 x 120 = 10,800 sq ft. 10,800 x $12.50 = $135,000."},
{s:"math",t:"Legal Descriptions",q:"How many acres are in the SE 1/4 of the NW 1/4 of a section?",o:["10 acres","40 acres","80 acres","160 acres"],a:1,e:"640 / 4 = 160; 160 / 4 = 40 acres. Multiply the denominators (4 x 4 = 16) and divide 640 by 16."},
{s:"math",t:"Transfer Taxes",q:"Documentary stamp tax on the deed for a $310,000 sale (outside Miami-Dade) is:",o:["$1,085","$1,550","$2,170","$3,100"],a:2,e:"$310,000 / $100 = 3,100 taxable units x $0.70 = $2,170. Round the price up to the next $100 when needed."},
{s:"math",t:"Transfer Taxes",q:"A buyer takes out a new $200,000 mortgage. Total state taxes on the note and mortgage (doc stamps on the note plus intangible tax) are:",o:["$400","$700","$1,100","$1,400"],a:2,e:"Note stamps: 2,000 units x $0.35 = $700. Intangible tax: $200,000 x 0.002 = $400. Total $1,100."},
{s:"math",t:"Prorations",q:"Annual property taxes are $3,650 ($10/day on a 365-day year). Closing is October 15, taxes unpaid, and the day of closing belongs to the buyer. The proration entry is:",o:["$780 credit to the seller","$2,870 debit to the seller, credit to the buyer","$2,880 debit to the buyer","$3,650 debit to the seller"],a:1,e:"Seller owes January 1 through October 14 = 287 days x $10 = $2,870, debited to the seller and credited to the buyer, who will pay the full bill."},
{s:"math",t:"Mortgage Math",q:"A $180,000 loan at 6% annual interest has a monthly payment of $1,079.19. How much of the first payment is interest?",o:["$900.00","$1,079.19","$179.19","$180.00"],a:0,e:"$180,000 x 0.06 = $10,800 / 12 = $900 interest. Principal reduction: $1,079.19 - $900 = $179.19."},
{s:"math",t:"Mortgage Math",q:"Purchase price is $250,000 and the appraisal comes in at $245,000. With an 80% LTV loan, the maximum loan amount is:",o:["$200,000","$196,000","$186,000","$204,000"],a:1,e:"LTV is based on the lesser of price or appraised value: $245,000 x 0.80 = $196,000."},
{s:"math",t:"Mortgage Math",q:"A borrower pays 2 discount points on a $240,000 loan. The charge is:",o:["$2,400","$4,800","$7,200","$9,600"],a:1,e:"Each point is 1% of the loan amount: $240,000 x 0.02 = $4,800."},
{s:"math",t:"Qualifying",q:"A buyer earns $72,000 per year and the proposed PITI payment is $1,560. The housing expense ratio is:",o:["24%","26%","28%","31%"],a:1,e:"Monthly income: $72,000 / 12 = $6,000. $1,560 / $6,000 = 0.26 = 26%."},
{s:"math",t:"Investment",q:"A property produces $36,000 in net operating income and sells for $450,000. The capitalization rate is:",o:["6%","7%","8%","9%"],a:2,e:"Rate = Income / Value: $36,000 / $450,000 = 8%."},
{s:"math",t:"Investment",q:"An investor requires a 9% return. A building generates $27,000 NOI. The maximum justified price is:",o:["$243,000","$270,000","$300,000","$330,000"],a:2,e:"Value = Income / Rate: $27,000 / 0.09 = $300,000."},
{s:"math",t:"Investment",q:"A house sells for $240,000 and rents for $2,000 per month. The gross rent multiplier is:",o:["100","110","120","144"],a:2,e:"GRM = price / monthly rent = $240,000 / $2,000 = 120."},
{s:"math",t:"Investment",q:"A retail lease calls for $1,200 per month base rent plus 3% of gross sales above $500,000. Sales were $740,000. Total annual rent is:",o:["$14,400","$21,600","$22,200","$36,600"],a:1,e:"Base: $1,200 x 12 = $14,400. Percentage: ($740,000 - $500,000) x 0.03 = $7,200. Total $21,600."},
{s:"math",t:"Appraisal Math",q:"Reproduction cost new of a building is $400,000, effective age 10 years, total economic life 50 years. Land is worth $100,000. Value by the cost approach is:",o:["$320,000","$400,000","$420,000","$500,000"],a:2,e:"Depreciation: 10/50 = 20% x $400,000 = $80,000. Building: $320,000 + land $100,000 = $420,000."},
{s:"math",t:"Percentages",q:"A home sells for $322,000, which is 15% more than the owner paid. The original price was:",o:["$273,700","$280,000","$285,000","$370,300"],a:1,e:"$322,000 / 1.15 = $280,000. Divide by (100% + 15%); do not subtract 15% of the sale price."},
{s:"math",t:"Seller Net",q:"A seller wants to net $282,000 after paying a 6% commission. Ignoring other costs, the sale price must be:",o:["$296,000","$298,920","$300,000","$316,800"],a:2,e:"Price = net / (1 - 0.06) = $282,000 / 0.94 = $300,000."},
{s:"math",t:"Property Tax",q:"A property has a taxable value of $130,000 and the total millage rate is 20 mills. Annual taxes are:",o:["$2,340","$2,600","$3,600","$2,860"],a:1,e:"20 mills = 0.020. $130,000 x 0.020 = $2,600."}
);

// ---------------- APP ----------------
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildExam() {
  const pick = (sec, n) => shuffle(BANK.filter((q) => q.s === sec)).slice(0, n);
  const qs = shuffle([...pick("law", BLUEPRINT.law), ...pick("pri", BLUEPRINT.pri), ...pick("math", BLUEPRINT.math)]);
  return qs.map((q) => {
    const opts = shuffle(q.o.map((t, i) => ({ t, c: i === q.a })));
    return { ...q, opts, correct: opts.findIndex((o) => o.c) };
  });
}

function fmt(secs) {
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

const Bubble = ({ children, state, onClick }) => {
  const base = "h-8 w-8 rounded-full border text-xs font-mono flex items-center justify-center transition-colors";
  const styles = {
    current: "border-slate-900 bg-slate-900 text-white ring-2 ring-slate-400",
    answered: "border-slate-700 bg-slate-700 text-white",
    flagged: "border-amber-500 bg-amber-100 text-amber-900",
    blank: "border-slate-300 bg-white text-slate-500 hover:border-slate-500",
  };
  return (
    <button onClick={onClick} className={`${base} ${styles[state]}`}>{children}</button>
  );
};

export default function App() {
  const [mode, setMode] = useState("home"); // home | exam | results | study
  const [exam, setExam] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [flags, setFlags] = useState(new Set());
  const [idx, setIdx] = useState(0);
  const [secs, setSecs] = useState(EXAM_SECONDS);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [quitConfirm, setQuitConfirm] = useState(false);
  const [pauseConfirm, setPauseConfirm] = useState(false);
  const [paused, setPaused] = useState(false);
  const [reviewFilter, setReviewFilter] = useState("missed");
  const [studySec, setStudySec] = useState("all");
  const [open, setOpen] = useState(new Set());

  useEffect(() => {
    if (mode !== "exam" || paused) return;
    const t = setInterval(() => {
      setSecs((s) => {
        if (s <= 1) {
          clearInterval(t);
          setMode("results");
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [mode, paused]);

  const startExam = () => {
    const e = buildExam();
    setExam(e);
    setAnswers(new Array(e.length).fill(null));
    setFlags(new Set());
    setIdx(0);
    setSecs(EXAM_SECONDS);
    setConfirmOpen(false);
    setQuitConfirm(false);
    setPauseConfirm(false);
    setPaused(false);
    setMode("exam");
  };

  const score = useMemo(() => {
    if (!exam) return 0;
    return exam.reduce((n, q, i) => n + (answers[i] === q.correct ? 1 : 0), 0);
  }, [exam, answers]);

  const bySection = useMemo(() => {
    if (!exam) return {};
    const out = {};
    exam.forEach((q, i) => {
      out[q.s] = out[q.s] || { right: 0, total: 0 };
      out[q.s].total++;
      if (answers[i] === q.correct) out[q.s].right++;
    });
    return out;
  }, [exam, answers]);

  const answeredCount = answers.filter((a) => a !== null).length;

  // ---------- HOME ----------
  if (mode === "home") {
    const counts = { law: 0, pri: 0, math: 0 };
    BANK.forEach((q) => counts[q.s]++);
    return (
      <div className="min-h-screen bg-stone-100 text-slate-900 font-sans">
        <div className="max-w-3xl mx-auto px-4 py-10">
          <p className="font-mono text-xs tracking-widest uppercase text-slate-500">Pearson VUE format · FREC blueprint</p>
          <h1 className="font-serif text-4xl mt-2">Florida Sales Associate<br />State Exam Prep</h1>
          <p className="mt-3 text-slate-600 max-w-xl">Original question bank of {BANK.length} items modeled on the official exam outline: 100 questions, 3 hours 30 minutes, 75 correct to pass. Each simulation draws {BLUEPRINT.law} law, {BLUEPRINT.pri} principles, and {BLUEPRINT.math} math questions at random, so every attempt is different.</p>
          <div className="mt-4 flex gap-2 flex-wrap text-xs">
            {Object.keys(counts).map((k) => (
              <span key={k} className={`px-2 py-1 rounded ${SEC_TAG[k]}`}>{SEC_NAME[k]}: {counts[k]} in bank</span>
            ))}
          </div>
          <div className="mt-8 grid sm:grid-cols-2 gap-4">
            <button onClick={startExam} className="text-left bg-slate-900 text-white rounded-lg p-6 hover:bg-slate-800 transition-colors">
              <p className="font-mono text-xs tracking-widest uppercase text-slate-400">Timed · 3:30:00</p>
              <p className="font-serif text-2xl mt-1">Exam simulation</p>
              <p className="mt-2 text-sm text-slate-300">100 questions, balanced like the real test. No answers shown until you submit. Auto-submits when time runs out.</p>
            </button>
            <button onClick={() => setMode("study")} className="text-left bg-white border border-slate-300 rounded-lg p-6 hover:border-slate-500 transition-colors">
              <p className="font-mono text-xs tracking-widest uppercase text-slate-400">Untimed</p>
              <p className="font-serif text-2xl mt-1">Study mode</p>
              <p className="mt-2 text-sm text-slate-600">Browse the full bank by section. Tap any question to reveal the answer and explanation.</p>
            </button>
          </div>
          <div className="mt-8 bg-white border border-slate-200 rounded-lg p-5 text-sm text-slate-600">
            <p className="font-serif text-lg text-slate-900">Exam rules to know</p>
            <p className="mt-2">Passing requires 75 of 100. The state exam is closed book; a basic calculator is allowed. Roughly 45 questions cover Florida license law and federal law, 45 cover principles and practices, and 10 are math. If you fail, you may retake after 24 hours by paying the exam fee again.</p>
          </div>
        </div>
      </div>
    );
  }

  // ---------- STUDY ----------
  if (mode === "study") {
    const list = BANK.map((q, i) => ({ ...q, id: i })).filter((q) => studySec === "all" || q.s === studySec);
    const toggle = (id) => {
      const s = new Set(open);
      s.has(id) ? s.delete(id) : s.add(id);
      setOpen(s);
    };
    return (
      <div className="min-h-screen bg-stone-100 text-slate-900 font-sans">
        <div className="sticky top-0 bg-stone-100 border-b border-slate-200 z-10">
          <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3 flex-wrap">
            <button onClick={() => setMode("home")} className="text-sm text-slate-500 hover:text-slate-900">&larr; Home</button>
            <p className="font-serif text-lg">Study mode</p>
            <div className="ml-auto flex gap-1 flex-wrap">
              {["all", "law", "pri", "math"].map((k) => (
                <button key={k} onClick={() => setStudySec(k)} className={`px-3 py-1 rounded-full text-xs border ${studySec === k ? "bg-slate-900 text-white border-slate-900" : "bg-white border-slate-300 hover:border-slate-500"}`}>
                  {k === "all" ? `All (${BANK.length})` : SEC_NAME[k]}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="max-w-3xl mx-auto px-4 py-6 space-y-3">
          {list.map((q, n) => {
            const revealed = open.has(q.id);
            return (
              <button key={q.id} onClick={() => toggle(q.id)} className="block w-full text-left bg-white border border-slate-200 rounded-lg p-4 hover:border-slate-400 transition-colors">
                <div className="flex items-start gap-3">
                  <span className="font-mono text-xs text-slate-400 pt-1">{String(n + 1).padStart(3, "0")}</span>
                  <div className="flex-1">
                    <div className="flex gap-2 items-center flex-wrap">
                      <span className={`px-2 py-0.5 rounded text-xs ${SEC_TAG[q.s]}`}>{q.t}</span>
                    </div>
                    <p className="mt-2 font-medium">{q.q}</p>
                    <div className="mt-2 space-y-1">
                      {q.o.map((opt, i) => (
                        <p key={i} className={`text-sm px-2 py-1 rounded ${revealed && i === q.a ? "bg-emerald-100 text-emerald-900 font-medium" : "text-slate-600"}`}>
                          <span className="font-mono text-xs mr-1">{"ABCD"[i]}.</span>{opt}
                        </p>
                      ))}
                    </div>
                    {revealed ? (
                      q.e ? <p className="mt-2 text-sm text-slate-600 border-t border-slate-100 pt-2">{q.e}</p> : null
                    ) : (
                      <p className="mt-2 text-xs text-slate-400">Tap to reveal answer</p>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // ---------- RESULTS ----------
  if (mode === "results" && exam) {
    const pass = score >= PASS_SCORE;
    const review = exam
      .map((q, i) => ({ ...q, i }))
      .filter((q) => {
        if (reviewFilter === "all") return true;
        if (reviewFilter === "missed") return answers[q.i] !== q.correct;
        if (reviewFilter === "flagged") return flags.has(q.i);
        return true;
      });
    return (
      <div className="min-h-screen bg-stone-100 text-slate-900 font-sans">
        <div className="max-w-3xl mx-auto px-4 py-10">
          <p className="font-mono text-xs tracking-widest uppercase text-slate-500">Results</p>
          <div className="mt-2 flex items-end gap-4 flex-wrap">
            <p className="font-serif text-6xl">{score}<span className="text-2xl text-slate-400">/100</span></p>
            <p className={`px-3 py-1 rounded-full text-sm font-medium mb-2 ${pass ? "bg-emerald-100 text-emerald-900" : "bg-rose-100 text-rose-900"}`}>
              {pass ? "PASS" : "FAIL"} · 75 needed
            </p>
          </div>
          <div className="mt-6 grid sm:grid-cols-3 gap-3">
            {Object.keys(bySection).map((k) => (
              <div key={k} className="bg-white border border-slate-200 rounded-lg p-4">
                <p className={`inline-block px-2 py-0.5 rounded text-xs ${SEC_TAG[k]}`}>{SEC_NAME[k]}</p>
                <p className="font-serif text-2xl mt-2">{bySection[k].right}<span className="text-sm text-slate-400">/{bySection[k].total}</span></p>
                <div className="mt-2 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-slate-800" style={{ width: `${(bySection[k].right / bySection[k].total) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 flex gap-2 flex-wrap items-center">
            <p className="font-serif text-xl mr-2">Review</p>
            {["missed", "flagged", "all"].map((f) => (
              <button key={f} onClick={() => setReviewFilter(f)} className={`px-3 py-1 rounded-full text-xs border capitalize ${reviewFilter === f ? "bg-slate-900 text-white border-slate-900" : "bg-white border-slate-300"}`}>{f}</button>
            ))}
            <div className="ml-auto flex gap-2">
              <button onClick={startExam} className="px-4 py-2 rounded-lg bg-slate-900 text-white text-sm hover:bg-slate-800">Retake exam</button>
              <button onClick={() => setMode("home")} className="px-4 py-2 rounded-lg border border-slate-300 text-sm bg-white hover:border-slate-500">Home</button>
            </div>
          </div>
          <div className="mt-4 space-y-3">
            {review.length === 0 && <p className="text-sm text-slate-500">Nothing to show under this filter.</p>}
            {review.map((q) => {
              const user = answers[q.i];
              return (
                <div key={q.i} className="bg-white border border-slate-200 rounded-lg p-4">
                  <div className="flex gap-2 items-center flex-wrap">
                    <span className="font-mono text-xs text-slate-400">Q{q.i + 1}</span>
                    <span className={`px-2 py-0.5 rounded text-xs ${SEC_TAG[q.s]}`}>{q.t}</span>
                    {flags.has(q.i) && <span className="px-2 py-0.5 rounded text-xs bg-amber-100 text-amber-900">Flagged</span>}
                  </div>
                  <p className="mt-2 font-medium">{q.q}</p>
                  <div className="mt-2 space-y-1">
                    {q.opts.map((opt, i) => {
                      let cls = "text-slate-600";
                      if (i === q.correct) cls = "bg-emerald-100 text-emerald-900 font-medium";
                      else if (i === user) cls = "bg-rose-100 text-rose-900 line-through";
                      return (
                        <p key={i} className={`text-sm px-2 py-1 rounded ${cls}`}>
                          <span className="font-mono text-xs mr-1">{"ABCD"[i]}.</span>{opt.t}
                        </p>
                      );
                    })}
                  </div>
                  {user === null && <p className="mt-2 text-xs text-rose-700">Not answered</p>}
                  {q.e && <p className="mt-2 text-sm text-slate-600 border-t border-slate-100 pt-2">{q.e}</p>}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ---------- EXAM ----------
  if (mode === "exam" && exam) {
    const q = exam[idx];
    const low = secs < 15 * 60;
    const toggleFlag = () => {
      const s = new Set(flags);
      s.has(idx) ? s.delete(idx) : s.add(idx);
      setFlags(s);
    };
    const select = (i) => {
      const a = [...answers];
      a[idx] = i;
      setAnswers(a);
    };
    return (
      <div className="min-h-screen bg-stone-100 text-slate-900 font-sans pb-10">
        <div className="sticky top-0 bg-white border-b border-slate-200 z-10">
          <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
            <button onClick={() => setQuitConfirm(true)} className="px-3 py-1.5 rounded-lg border border-slate-300 text-sm bg-white hover:border-slate-500">Home</button>
            <p className="font-serif hidden sm:block">Exam simulation</p>
            <span className="text-xs text-slate-500">{answeredCount}/100 answered</span>
            <div className="ml-auto flex items-center gap-3">
              <span className={`font-mono text-lg tabular-nums ${low ? "text-rose-600" : "text-slate-900"}`}>{fmt(secs)}</span>
              <button onClick={() => setPauseConfirm(true)} className="px-3 py-1.5 rounded-lg border border-slate-300 text-sm bg-white hover:border-slate-500">Pause</button>
              <button onClick={() => setConfirmOpen(true)} className="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-sm hover:bg-slate-800">Submit</button>
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 py-6">
          <div className="bg-white border border-slate-200 rounded-lg p-5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-sm text-slate-500">Question {idx + 1} of 100</span>
              <span className={`px-2 py-0.5 rounded text-xs ${SEC_TAG[q.s]}`}>{SEC_NAME[q.s]}</span>
              <button onClick={toggleFlag} className={`ml-auto px-3 py-1 rounded-full text-xs border ${flags.has(idx) ? "bg-amber-100 border-amber-400 text-amber-900" : "bg-white border-slate-300 text-slate-500 hover:border-amber-400"}`}>
                {flags.has(idx) ? "Flagged" : "Flag for review"}
              </button>
            </div>
            <p className="mt-4 text-lg">{q.q}</p>
            <div className="mt-4 space-y-2">
              {q.opts.map((opt, i) => (
                <button key={i} onClick={() => select(i)} className={`block w-full text-left px-4 py-3 rounded-lg border transition-colors ${answers[idx] === i ? "border-slate-900 bg-slate-900 text-white" : "border-slate-300 bg-white hover:border-slate-500"}`}>
                  <span className="font-mono text-xs mr-2">{"ABCD"[i]}.</span>{opt.t}
                </button>
              ))}
            </div>
            <div className="mt-5 flex gap-2">
              <button disabled={idx === 0} onClick={() => setIdx(idx - 1)} className="px-4 py-2 rounded-lg border border-slate-300 text-sm bg-white disabled:opacity-40">Previous</button>
              <button disabled={idx === 99} onClick={() => setIdx(idx + 1)} className="px-4 py-2 rounded-lg border border-slate-300 text-sm bg-white disabled:opacity-40 ml-auto">Next</button>
            </div>
          </div>

          <div className="mt-6 bg-white border border-slate-200 rounded-lg p-4">
            <p className="font-mono text-xs tracking-widest uppercase text-slate-400 mb-3">Answer sheet</p>
            <div className="flex flex-wrap gap-1.5">
              {exam.map((_, i) => {
                let state = "blank";
                if (flags.has(i)) state = "flagged";
                if (answers[i] !== null && !flags.has(i)) state = "answered";
                if (i === idx) state = "current";
                return <Bubble key={i} state={state} onClick={() => setIdx(i)}>{i + 1}</Bubble>;
              })}
            </div>
            <p className="mt-3 text-xs text-slate-400">Dark: answered · Amber: flagged · White: blank</p>
          </div>
        </div>

        {quitConfirm && (
          <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-20">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full">
              <p className="font-serif text-xl">Quit exam?</p>
              <p className="mt-2 text-sm text-slate-600">All progress will be lost. Your {answeredCount} answered question{answeredCount === 1 ? "" : "s"} will not be scored or saved. Are you sure you want to quit?</p>
              <div className="mt-4 flex gap-2 justify-end">
                <button onClick={() => setQuitConfirm(false)} className="px-4 py-2 rounded-lg border border-slate-300 text-sm">Keep working</button>
                <button onClick={() => { setQuitConfirm(false); setPaused(false); setMode("home"); }} className="px-4 py-2 rounded-lg bg-rose-600 text-white text-sm hover:bg-rose-700">Quit exam</button>
              </div>
            </div>
          </div>
        )}

        {pauseConfirm && (
          <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-20">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full">
              <p className="font-serif text-xl">Pause the timer?</p>
              <p className="mt-2 text-sm text-slate-600">The clock will stop and questions will be hidden until you resume. The real exam has no pause, so use this sparingly. Are you sure?</p>
              <div className="mt-4 flex gap-2 justify-end">
                <button onClick={() => setPauseConfirm(false)} className="px-4 py-2 rounded-lg border border-slate-300 text-sm">Cancel</button>
                <button onClick={() => { setPauseConfirm(false); setPaused(true); }} className="px-4 py-2 rounded-lg bg-slate-900 text-white text-sm">Pause timer</button>
              </div>
            </div>
          </div>
        )}

        {paused && !quitConfirm && (
          <div className="fixed inset-0 bg-stone-100 flex items-center justify-center p-4 z-30">
            <div className="text-center">
              <p className="font-mono text-xs tracking-widest uppercase text-slate-400">Paused</p>
              <p className="mt-2 font-mono text-4xl tabular-nums">{fmt(secs)}</p>
              <p className="mt-2 text-sm text-slate-500">{answeredCount}/100 answered. Questions are hidden while paused.</p>
              <div className="mt-6 flex gap-2 justify-center">
                <button onClick={() => setPaused(false)} className="px-5 py-2.5 rounded-lg bg-slate-900 text-white text-sm hover:bg-slate-800">Resume exam</button>
                <button onClick={() => setQuitConfirm(true)} className="px-5 py-2.5 rounded-lg border border-slate-300 text-sm bg-white hover:border-slate-500">Home</button>
              </div>
            </div>
          </div>
        )}

        {confirmOpen && (
          <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-20">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full">
              <p className="font-serif text-xl">Submit exam?</p>
              <p className="mt-2 text-sm text-slate-600">
                {100 - answeredCount === 0 ? "All 100 questions answered." : `${100 - answeredCount} question${100 - answeredCount === 1 ? " is" : "s are"} unanswered and will be scored as incorrect.`}
              </p>
              <div className="mt-4 flex gap-2 justify-end">
                <button onClick={() => setConfirmOpen(false)} className="px-4 py-2 rounded-lg border border-slate-300 text-sm">Keep working</button>
                <button onClick={() => { setConfirmOpen(false); setMode("results"); }} className="px-4 py-2 rounded-lg bg-slate-900 text-white text-sm">Submit now</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
}
