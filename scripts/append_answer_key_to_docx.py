import docx
from docx.shared import Pt, Inches, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn
import json

def set_cell_background(cell, fill_hex):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = parse_xml(f'<w:tcMar {nsdecls("w")}><w:top w:w="{top}" w:type="dxa"/><w:bottom w:w="{bottom}" w:type="dxa"/><w:left w:w="{left}" w:type="dxa"/><w:right w:w="{right}" w:type="dxa"/></w:tcMar>')
    tcPr.append(tcMar)

def create_answer_doc():
    doc = docx.Document('output/de-cuong-on-tap-tin-12/De_cuong_on_tap_giua_ki_1_Tin_12.docx')
    
    with open('tmp/review_answers.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    mc = data['mc']
    tf = data['tf']
    essay = data['essay']
    
    # Thêm trang mới
    doc.add_page_break()
    
    # Tiêu đề phần đáp án
    p_title = doc.add_paragraph()
    p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run_title = p_title.add_run("BẢNG ĐÁP ÁN & HƯỚNG DẪN GIẢI CHI TIẾT")
    run_title.font.name = "Times New Roman"
    run_title.font.size = Pt(16)
    run_title.font.bold = True
    run_title.font.color.rgb = RGBColor(13, 124, 134) # Màu sea
    
    p_sub = doc.add_paragraph()
    p_sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run_sub = p_sub.add_run("(Dành cho giáo viên & học sinh tự đối chiếu, đánh giá)")
    run_sub.font.name = "Times New Roman"
    run_sub.font.size = Pt(11)
    run_sub.font.italic = True
    
    # -------------------------------------------------------------
    # 1. BẢNG ĐÁP ÁN NHANH 60 CÂU TNKQ (Dạng lưới gọn 6 hàng x 10 cột)
    # -------------------------------------------------------------
    p_h1 = doc.add_paragraph()
    run_h1 = p_h1.add_run("1. BẢNG ĐÁP ÁN 60 CÂU TRẮC NGHIỆM KHÁCH QUAN")
    run_h1.font.name = "Times New Roman"
    run_h1.font.size = Pt(13)
    run_h1.font.bold = True
    run_h1.font.color.rgb = RGBColor(7, 91, 99)
    
    # Bảng 10 cột, mỗi ô gồm Câu - Đáp án
    table_mc = doc.add_table(rows=1, cols=10)
    table_mc.alignment = WD_TABLE_ALIGNMENT.CENTER
    
    hdr_cells = table_mc.rows[0].cells
    for i in range(10):
        hdr_cells[i].text = f"Cột {i+1}"
        set_cell_background(hdr_cells[i], "0D7C86")
        p = hdr_cells[i].paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        for r in p.runs:
            r.font.name = "Times New Roman"
            r.font.size = Pt(10)
            r.font.bold = True
            r.font.color.rgb = RGBColor(255, 255, 255)
            
    # Xoá header và tạo lại bảng gồm 6 hàng x 10 cột
    # Mỗi cột hiển thị: Câu: Đáp án (VD: 1. B)
    # Để bảng đẹp nhất: 12 hàng x 10 cột: Hàng Câu, Hàng ĐA
    doc.element.body.remove(table_mc._element)
    
    table_grid = doc.add_table(rows=12, cols=10)
    table_grid.alignment = WD_TABLE_ALIGNMENT.CENTER
    
    for row_pair in range(6):
        c_row = row_pair * 2
        a_row = row_pair * 2 + 1
        for col in range(10):
            idx = row_pair * 10 + col
            cell_c = table_grid.rows[c_row].cells[col]
            cell_a = table_grid.rows[a_row].cells[col]
            
            cell_c.text = f"Câu {idx + 1}"
            set_cell_background(cell_c, "F5F8F9")
            p_c = cell_c.paragraphs[0]
            p_c.alignment = WD_ALIGN_PARAGRAPH.CENTER
            for r in p_c.runs:
                r.font.name = "Times New Roman"
                r.font.size = Pt(9.5)
                r.font.bold = True
                
            cell_a.text = mc[idx]['answerLetter']
            p_a = cell_a.paragraphs[0]
            p_a.alignment = WD_ALIGN_PARAGRAPH.CENTER
            for r in p_a.runs:
                r.font.name = "Times New Roman"
                r.font.size = Pt(11)
                r.font.bold = True
                r.font.color.rgb = RGBColor(220, 38, 38) # Màu đỏ
                
            set_cell_margins(cell_c, top=60, bottom=60, left=60, right=60)
            set_cell_margins(cell_a, top=60, bottom=60, left=60, right=60)

    # -------------------------------------------------------------
    # 2. ĐÁP ÁN CHI TIẾT 12 CÂU ĐÚNG / SAI
    # -------------------------------------------------------------
    doc.add_paragraph() # Dòng trống
    p_h2 = doc.add_paragraph()
    run_h2 = p_h2.add_run("2. ĐÁP ÁN 12 CÂU TRẮC NGHIỆM ĐÚNG / SAI (48 NHẬN ĐỊNH)")
    run_h2.font.name = "Times New Roman"
    run_h2.font.size = Pt(13)
    run_h2.font.bold = True
    run_h2.font.color.rgb = RGBColor(7, 91, 99)
    
    table_tf = doc.add_table(rows=1, cols=4)
    table_tf.alignment = WD_TABLE_ALIGNMENT.CENTER
    hdr = table_tf.rows[0].cells
    hdr[0].text = "Câu"
    hdr[1].text = "Bài học"
    hdr[2].text = "Đáp án 4 ý (a, b, c, d)"
    hdr[3].text = "Giải thích ngắn gọn"
    
    for i, c in enumerate(hdr):
        set_cell_background(c, "0D7C86")
        p = c.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        for r in p.runs:
            r.font.name = "Times New Roman"
            r.font.size = Pt(10.5)
            r.font.bold = True
            r.font.color.rgb = RGBColor(255, 255, 255)
            
    for item in tf:
        row_cells = table_tf.add_row().cells
        row_cells[0].text = f"Câu {item['index']}"
        row_cells[1].text = f"Bài {item['lesson']}"
        
        # 4 ý
        res_text = "\n".join([f"Ý {s['label']}: {s['answer']}" for s in item['statements']])
        row_cells[2].text = res_text
        
        # Giải thích
        exp_text = "\n".join([f"• Ý {s['label']}: {s['explain']}" for s in item['statements']])
        row_cells[3].text = exp_text
        
        row_cells[0].paragraphs[0].alignment = WD_ALIGN_PARAGRAPH.CENTER
        row_cells[1].paragraphs[0].alignment = WD_ALIGN_PARAGRAPH.CENTER
        
        for c in row_cells:
            for p in c.paragraphs:
                for r in p.runs:
                    r.font.name = "Times New Roman"
                    r.font.size = Pt(10)
            set_cell_margins(c, top=80, bottom=80, left=100, right=100)

    # -------------------------------------------------------------
    # 3. HƯỚNG DẪN GIẢI & RUBRIC 8 CÂU TỰ LUẬN
    # -------------------------------------------------------------
    doc.add_paragraph() # Dòng trống
    p_h3 = doc.add_paragraph()
    run_h3 = p_h3.add_run("3. HƯỚNG DẪN GIẢI & RUBRIC CHẤM 8 CÂU TỰ LUẬN")
    run_h3.font.name = "Times New Roman"
    run_h3.font.size = Pt(13)
    run_h3.font.bold = True
    run_h3.font.color.rgb = RGBColor(7, 91, 99)
    
    for item in essay:
        p_q = doc.add_paragraph()
        run_q = p_q.add_run(f"Câu {item['index']} (Bài {item['lesson']} - {item['level'].upper()}): {item['prompt']}")
        run_q.font.name = "Times New Roman"
        run_q.font.size = Pt(11)
        run_q.font.bold = True
        
        # Gợi ý đáp án
        p_ans = doc.add_paragraph()
        run_ans_lbl = p_ans.add_run("• Gợi ý đáp án: ")
        run_ans_lbl.font.bold = True
        run_ans_lbl.font.color.rgb = RGBColor(14, 159, 110)
        run_ans_val = p_ans.add_run(item['answer'])
        p_ans.paragraph_format.left_indent = Inches(0.2)
        for r in p_ans.runs:
            r.font.name = "Times New Roman"
            r.font.size = Pt(10.5)
            
        # Tiêu chí rubric
        p_rub_hdr = doc.add_paragraph()
        run_rub_lbl = p_rub_hdr.add_run("• 4 tiêu chí đánh giá (Rubric):")
        run_rub_lbl.font.bold = True
        run_rub_lbl.font.italic = True
        p_rub_hdr.paragraph_format.left_indent = Inches(0.2)
        run_rub_lbl.font.name = "Times New Roman"
        run_rub_lbl.font.size = Pt(10)
        
        for r_idx, crit in enumerate(item['rubric']):
            p_crit = doc.add_paragraph()
            p_crit.paragraph_format.left_indent = Inches(0.4)
            r_c = p_crit.add_run(f"- Tiêu chí {r_idx + 1}: {crit}")
            r_c.font.name = "Times New Roman"
            r_c.font.size = Pt(10)
            
        doc.add_paragraph() # Cách một đoạn nhỏ

    out_path = 'output/de-cuong-on-tap-tin-12/De_cuong_on_tap_giua_ki_1_Tin_12_Co_Dap_An.docx'
    doc.save(out_path)
    print(f"Successfully generated: {out_path}")

if __name__ == '__main__':
    create_answer_doc()
